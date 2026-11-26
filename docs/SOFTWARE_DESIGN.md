# Foodly — Software Design Document (SDD)

> [!NOTE]
> This document defines the target software architecture, **MySQL** data model, **Cash on Delivery (COD) + Online Payment** flows, APIs, and phased roadmap for **Foodly** (*Food Delivery Ecosystem*), building on the React + Vite + Tailwind CSS frontend in [`frontend/`](../frontend).

---

## 1. System Overview & User Personas (4 User Types)

Foodly is a 4-role food delivery ecosystem:

| User Type | Role Key | Primary Responsibilities | Client Surface |
| :--- | :--- | :--- | :--- |
| **1. Normal User** | `customer` | Browse restaurants & categories, manage cart, choose **Cash on Delivery (COD)** or **Online Payment**, track live delivery, rate orders | Customer Web App (`frontend/`) |
| **2. Rider** | `rider` | Toggle online/offline, accept delivery jobs, stream GPS location, collect **COD cash** at doorstep, mark delivery & cash settlement | Rider Portal / Mobile Web |
| **3. Restaurant Portal** | `restaurant` | Manage store profile, menu items & availability, accept/reject incoming orders (both COD & prepaid), update kitchen prep status | Restaurant Portal |
| **4. Administration** | `admin` | Verify/approve restaurants & riders, manage categories & promos, monitor COD cash settlements, handle disputes & platform analytics | Admin Dashboard |

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Clients["4 Client Portals"]
        Web["1. Normal User Web App (React + Tailwind)"]
        Rider["2. Rider App / Portal"]
        Partner["3. Restaurant Portal"]
        Admin["4. Administration Console"]
    end

    subgraph Edge["API & Real-Time Gateway"]
        API["REST API Server (RBAC by 4 Roles)"]
        WS["WebSocket Server (Live Tracking & Order Events)"]
    end

    subgraph Services["Core Domain Services"]
        Auth["Auth & Identity (JWT + Role Guards)"]
        Catalog["Restaurant & Menu Service"]
        Order["Order & Cart Service (COD + Prepaid)"]
        Dispatch["Rider Dispatch & Geo Service"]
        Payment["Payment & COD Ledger Service"]
        Notify["Notification Service (Push / Email / SMS)"]
    end

    subgraph Data["Data & Infrastructure"]
        DB[("MySQL 8.0+ (Primary Relational DB)")]
        Redis[("Redis (Cache, Geo-Hash, Pub/Sub)")]
        Storage["Object Storage / CDN (Menu & Hero Images)"]
        Gateway["External Payment Gateway (Optional Online Pay)"]
    end

    Web --> API
    Rider --> API
    Partner --> API
    Admin --> API
    Web <--> WS
    Rider <--> WS
    Partner <--> WS

    API --> Auth
    API --> Catalog
    API --> Order
    API --> Dispatch
    API --> Payment
    WS <--> Redis

    Auth --> DB
    Catalog --> DB
    Catalog --> Redis
    Catalog --> Storage
    Order --> DB
    Order --> Redis
    Order --> Notify
    Dispatch --> Redis
    Dispatch --> DB
    Payment --> Gateway
    Payment --> DB
```

---

## 3. Recommended Tech Stack

### Frontend (Already Initialized)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: `lucide-react`
- **Future Additions**:
  - **Routing**: `react-router-dom` with role-protected routes (`/`, `/login`, `/signup`, `/restaurant/:slug`, `/checkout`, `/rider`, `/partner`, `/admin`)
  - **Server State**: `@tanstack/react-query`
  - **Forms & Validation**: `react-hook-form` + `zod`
  - **Maps**: Leaflet / Mapbox GL JS for delivery address pinning and live rider tracking

### Backend & Database (Future)
- **Database**: **MySQL 8.0+** (InnoDB engine, `DECIMAL(10,2)` for currency, `POINT` spatial columns with `ST_Distance_Sphere` for nearby restaurant & rider queries)
- **Backend API**: Node.js (Express / NestJS with Prisma or TypeORM) **or** Python (FastAPI + SQLAlchemy)
- **Cache & Real-Time**: Redis (cart/session cache, live rider coordinates, WebSocket Pub/Sub)
- **Payments**: Cash on Delivery (COD) built-in + optional Online Payment Gateway (Stripe / SSLCommerz)

---

## 4. MySQL Database Schema (ER Diagram)

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : has
    USERS ||--o{ ORDERS : places
    USERS ||--o| RESTAURANTS : manages
    USERS ||--o| RIDERS : operates_as
    RESTAURANTS ||--o{ MENU_ITEMS : offers
    CATEGORIES ||--o{ MENU_ITEMS : groups
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : referenced_in
    ORDERS ||--|| PAYMENTS : settled_by
    ORDERS ||--o| DELIVERIES : fulfilled_by
    RIDERS ||--o{ DELIVERIES : assigned_to

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar phone
        varchar password_hash
        enum role "customer | rider | restaurant | admin"
        boolean is_active
        timestamp created_at
    }
    ADDRESSES {
        bigint id PK
        bigint user_id FK
        varchar label "Home | Work"
        varchar street_address
        decimal latitude
        decimal longitude
        boolean is_default
    }
    RESTAURANTS {
        bigint id PK
        bigint owner_id FK
        varchar name
        varchar slug UK
        decimal rating
        int prep_time_mins
        decimal latitude
        decimal longitude
        boolean is_verified
        boolean is_open
    }
    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar icon_url
        int sort_order
    }
    MENU_ITEMS {
        bigint id PK
        bigint restaurant_id FK
        bigint category_id FK
        varchar name
        text description
        decimal price
        varchar image_url
        boolean is_available
    }
    ORDERS {
        bigint id PK
        bigint customer_id FK
        bigint restaurant_id FK
        bigint address_id FK
        enum payment_method "cod | online"
        enum payment_status "unpaid | pending | paid | failed | refunded"
        enum order_status "pending_payment | confirmed | preparing | ready | out_for_delivery | delivered | cancelled"
        decimal subtotal
        decimal delivery_fee
        decimal total_amount
        timestamp created_at
    }
    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint menu_item_id FK
        int quantity
        decimal unit_price
    }
    PAYMENTS {
        bigint id PK
        bigint order_id FK
        enum method "cod | online"
        varchar provider_ref "Nullable for COD"
        decimal amount
        enum status "unpaid | pending | paid | failed | refunded"
        bigint collected_by_rider_id FK "Nullable, used for COD"
        boolean cash_settled_to_platform
        timestamp paid_at
    }
    RIDERS {
        bigint id PK
        bigint user_id FK
        varchar vehicle_type
        boolean is_verified
        boolean is_available
        decimal cod_cash_in_hand
        decimal current_lat
        decimal current_lng
    }
    DELIVERIES {
        bigint id PK
        bigint order_id FK
        bigint rider_id FK
        enum status "assigned | picked_up | delivered"
        decimal cod_collected_amount
        timestamp picked_up_at
        timestamp delivered_at
    }
```

---

## 5. Order Lifecycle & Cash on Delivery (COD) Flow

### Order State Machine

```mermaid
stateDiagram-v2
    [*] --> PendingPayment : Checkout with Online Payment
    [*] --> Confirmed : Checkout with Cash on Delivery (payment_status = unpaid)

    PendingPayment --> Confirmed : Payment webhook succeeds (payment_status = paid)
    PendingPayment --> Cancelled : Payment fails / expires

    Confirmed --> Preparing : Restaurant accepts order
    Confirmed --> Cancelled : Restaurant rejects (auto-refund if online)

    Preparing --> ReadyForPickup : Kitchen finishes prep
    ReadyForPickup --> OutForDelivery : Rider picks up order

    OutForDelivery --> Delivered : Rider delivers & collects COD cash if unpaid
    Delivered --> [*]
    Cancelled --> [*]
```

### Checkout & Delivery Sequence (Online vs. Cash on Delivery)

```mermaid
sequenceDiagram
    actor Customer as Normal User
    participant Web as Frontend (React)
    participant API as Backend API
    participant DB as MySQL
    participant Pay as Payment Gateway
    participant WS as WebSocket Hub
    actor Restaurant as Restaurant Portal
    actor Rider as Rider

    Customer->>Web: Select payment method ("cod" or "online") & Place Order
    Web->>API: POST /api/v1/orders (cart, addressId, paymentMethod)

    alt Cash on Delivery (COD)
        API->>DB: Insert ORDER (order_status=confirmed, payment_method=cod, payment_status=unpaid)
        API-->>Web: Order Confirmed (Pay cash on delivery)
        API->>WS: Emit "order.created" to Restaurant
    else Online Payment
        API->>DB: Insert ORDER (order_status=pending_payment, payment_method=online)
        API->>Pay: Create Payment Intent
        Pay-->>Web: Checkout / Payment URL
        Customer->>Pay: Complete Online Payment
        Pay->>API: Webhook (payment.succeeded)
        API->>DB: Update ORDER (order_status=confirmed, payment_status=paid)
        API->>WS: Emit "order.created" to Restaurant
    end

    Restaurant->>API: PATCH /partner/orders/:id/status (preparing -> ready)
    API->>Rider: Dispatch nearest available rider
    Rider->>WS: Stream GPS location every 5s
    WS-->>Web: Live rider pin update

    Rider->>Customer: Deliver food
    opt If payment_method == "cod"
        Customer->>Rider: Pay cash in hand
        Rider->>API: PATCH /rider/deliveries/:id/complete (codCollectedAmount)
        API->>DB: Mark payment_status=paid & increment rider.cod_cash_in_hand
    end
```

---

## 6. Core API Endpoints (Planned)

| Role Access | Method & Endpoint | Purpose |
| :--- | :--- | :--- |
| **Public / All** | `POST /api/v1/auth/register` | Register account (`customer`, `rider`, or `restaurant`) |
| **Public / All** | `POST /api/v1/auth/login` | Authenticate & return JWT + user role |
| **Normal User** | `GET /api/v1/restaurants?lat=&lng=&category=&q=` | Geo-filtered & searchable restaurants via MySQL spatial query |
| **Normal User** | `GET /api/v1/restaurants/:slug/menu` | Restaurant details & available menu items |
| **Normal User** | `POST /api/v1/orders` | Create order with `payment_method: "cod" \| "online"` |
| **Normal User** | `GET /api/v1/orders/:id` | View order status, payment status & live tracking |
| **Restaurant** | `GET /api/v1/partner/orders` | List incoming & active orders for the restaurant |
| **Restaurant** | `PATCH /api/v1/partner/orders/:id/status` | Accept, mark `preparing`, or mark `ready` |
| **Restaurant** | `POST /api/v1/partner/menu-items` | Add/update menu items & toggle availability |
| **Rider** | `PATCH /api/v1/rider/availability` | Go online/offline & update GPS coordinates |
| **Rider** | `PATCH /api/v1/rider/deliveries/:id/complete` | Confirm delivery + record COD cash collected |
| **Admin** | `PATCH /api/v1/admin/restaurants/:id/verify` | Approve/suspend restaurants & riders |
| **Admin** | `POST /api/v1/admin/riders/:id/settle-cod` | Reconcile COD cash collected by a rider |

---

## 7. Security & COD Safeguards

- **4-Role RBAC**: Every API route enforces role middleware (`customer`, `rider`, `restaurant`, `admin`) using JWT access tokens + HTTP-only refresh cookies.
- **Server-Side Pricing**: Totals (`subtotal`, `delivery_fee`, `total_amount`) are always calculated on the server from MySQL `MENU_ITEMS.price`—never trusted from the client.
- **COD Risk & Ledger Controls**:
  - Configurable **max COD order limit** (e.g., orders above a threshold require online payment).
  - **COD Ledger**: `RIDERS.cod_cash_in_hand` tracks unremitted cash; Admin settles it via `settle-cod`, and riders exceeding a cash cap are paused from new COD jobs until settled.
  - **Abuse Prevention**: Accounts with repeated unaccepted/cancelled COD orders can be flagged or restricted to prepaid-only.
- **MySQL Indexing**: Composite indexes on `(customer_id, created_at)`, `(restaurant_id, order_status)`, and spatial indexes on restaurant/address coordinates.

---

## 8. Phased Implementation Roadmap

1. **Phase 1 — Frontend Foundation (Current)**:
   - Landing page (`Navbar`, `Hero`, `PopularCategories`), `Login`, and `SignUp` components in [`frontend/`](../frontend).
2. **Phase 2 — MySQL Database & Auth API**:
   - Set up MySQL 8.0+ schema & migrations, 4-role registration/login endpoints, and connect `Login.jsx` & `SignUp.jsx`.
3. **Phase 3 — Customer Ordering & COD Checkout**:
   - Restaurant listing, menu page, cart persistence, and Checkout supporting **Cash on Delivery** & Online Payment.
4. **Phase 4 — Rider, Restaurant & Admin Portals**:
   - Real-time WebSocket order board for **Restaurant Portal**, GPS & COD collection flow for **Rider**, and verification/COD settlement tools for **Administration**.
