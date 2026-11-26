# Food Delivery Ecosystem: Phase 2 Software Design
 
| Item | Value |
|---|---|
| Stack | React, Django REST Framework (DRF), MySQL 8 (InnoDB) |
| Architecture | Modular monolith |
| Team / target | 2 members|
| Input | SRS v1.1 |
| Status | Draft, review with both members before coding |
 
Phase 1 defined **what** the system does. Phase 2 defines **how** it is built. Do not create Django models until the team has agreed on the ERD (Section 3) and the decisions in Section 9.
 
---
 
## 1. Architecture
 
One Django backend split into modules, one React frontend with a dashboard per role. No microservices.
 
```mermaid
flowchart TB
    classDef user fill:#E8F0FE,stroke:#4285F4,color:#111
    classDef fe fill:#E6F4EA,stroke:#34A853,color:#111
    classDef be fill:#FEF7E0,stroke:#F9AB00,color:#111
    classDef db fill:#FCE8E6,stroke:#EA4335,color:#111
 
    C([Customer]):::user
    R([Restaurant]):::user
    D([Rider]):::user
    A([Admin]):::user
 
    subgraph FE["React Frontend"]
        direction LR
        PAGES[Role-based pages]:::fe --> ROUTER[React Router + ProtectedRoute]:::fe --> API_CLIENT[Axios API client]:::fe
    end
 
    subgraph BE["Django REST Framework"]
        direction LR
        AUTH[accounts<br/>JWT, roles]:::be
        REST[restaurants + menu]:::be
        ORD[orders<br/>cart, checkout, status]:::be
        DEL[deliveries<br/>rider assignment]:::be
        DASH[dashboard<br/>statistics]:::be
    end
 
    DB[(MySQL)]:::db
 
    C --> PAGES
    R --> PAGES
    D --> PAGES
    A --> PAGES
    API_CLIENT -->|"HTTPS + JWT, JSON"| BE
    BE --> DB
```
 
### Backend modules
 
```text
backend/
├── config/         settings, root urls
├── accounts/       custom User, auth, permissions
├── restaurants/    Restaurant
├── menu/           Category, FoodItem
├── orders/         Cart, CartItem, Order, OrderItem
├── deliveries/     Delivery
└── dashboard/      admin statistics
```
 
| Module | Responsibility |
|---|---|
| `accounts` | Custom user model, register, login, JWT, role permission classes |
| `restaurants` | Restaurant profile, ownership, open/closed state |
| `menu` | Categories and food items |
| `orders` | Cart, checkout, order items, status transitions |
| `deliveries` | Rider assignment, delivery updates, issue reports |
| `dashboard` | Read-only admin statistics |
 
### Team split (suggested)
 
| Member | Owns |
|---|---|
| A | `accounts`, `restaurants`, `menu`, customer pages, restaurant pages |
| B | `orders`, `deliveries`, `dashboard`, rider pages, admin pages |
 
Shared: API contract, permission classes, and the order status service.
 
---
 
## 2. Design Decisions
 
| Topic | Decision |
|---|---|
| User model | One custom user model with `role`: `CUSTOMER`, `RESTAURANT`, `RIDER`, `ADMIN` |
| Account creation | Public registration creates customers only; admin creates restaurant and rider accounts |
| Restaurant ownership | One owner per restaurant, one restaurant per owner (no staff accounts) |
| Menu | Categories belong to a restaurant; food items belong to a category |
| Cart | One cart per customer, tied to one restaurant |
| Different-restaurant item | API returns `409` with a message; customer must clear the cart first |
| Order snapshots | Order stores address and phone; order items store food name and unit price |
| Payment | COD only; `payment_status` is separate from order `status` |
| COD paid | Set to `PAID` when the rider confirms cash collected on delivery |
| Delivery fee | Fixed backend setting, default `0` |
| Delivery tracking | Order `status` is the single source of truth; `Delivery` stores only assignment, timestamps, and issue note |
| Deletion | Food items and restaurants are deactivated, never hard-deleted |
| Money | `DecimalField`, never float |
 
---
 
## 3. Database Design
 
### 3.1 Entity Relationship Diagram
 
```mermaid
erDiagram
    USER ||--o| RESTAURANT : "owns"
    USER ||--o| CART : "has"
    USER ||--o{ ORDER : "places"
    USER ||--o{ DELIVERY : "delivers as rider"
 
    RESTAURANT ||--o{ CATEGORY : "has"
    RESTAURANT ||--o{ ORDER : "receives"
    RESTAURANT |o--o{ CART : "selected in"
 
    CATEGORY ||--o{ FOOD_ITEM : "contains"
    CART ||--o{ CART_ITEM : "contains"
    FOOD_ITEM ||--o{ CART_ITEM : "added as"
 
    ORDER ||--|{ ORDER_ITEM : "contains"
    FOOD_ITEM ||--o{ ORDER_ITEM : "purchased as"
    ORDER ||--o| DELIVERY : "assigned via"
 
    USER {
        bigint id PK
        string username UK
        string email UK
        string password
        string phone
        string role
        boolean is_active
    }
    RESTAURANT {
        bigint id PK
        bigint owner_id FK, UK
        string name
        string address
        string phone
        boolean is_open
        boolean is_active
    }
    CATEGORY {
        bigint id PK
        bigint restaurant_id FK
        string name
    }
    FOOD_ITEM {
        bigint id PK
        bigint category_id FK
        string name
        decimal price
        boolean is_available
        boolean is_deleted
    }
    CART {
        bigint id PK
        bigint customer_id FK, UK
        bigint restaurant_id FK
    }
    CART_ITEM {
        bigint id PK
        bigint cart_id FK
        bigint food_item_id FK
        int quantity
    }
    ORDER {
        bigint id PK
        bigint customer_id FK
        bigint restaurant_id FK
        string status
        string payment_method
        string payment_status
        string delivery_address
        string contact_phone
        decimal subtotal
        decimal delivery_fee
        decimal total_amount
        datetime created_at
    }
    ORDER_ITEM {
        bigint id PK
        bigint order_id FK
        bigint food_item_id FK
        string food_name
        decimal unit_price
        int quantity
        decimal line_total
    }
    DELIVERY {
        bigint id PK
        bigint order_id FK, UK
        bigint rider_id FK
        datetime assigned_at
        datetime picked_up_at
        datetime delivered_at
        string issue_note
    }
```
 
`PK` primary key, `FK` foreign key, `UK` unique.
 
### 3.2 Tables and Constraints
 
| Table | Key rules |
|---|---|
| `User` | `username` and `email` unique; password hashed by Django; `role` limited to four values |
| `Restaurant` | `owner_id` unique (one restaurant per owner); `name`, `address`, `phone` required |
| `Category` | Unique (`restaurant_id`, `name`) |
| `FoodItem` | `price` > 0; restaurant is derived through Category |
| `Cart` | `customer_id` unique; `restaurant_id` set on first item, cleared when the cart is emptied |
| `CartItem` | Unique (`cart_id`, `food_item_id`); `quantity` >= 1 |
| `Order` | Starts as `status = PENDING`, `payment_status = PENDING`, `payment_method = COD`; totals calculated by the backend |
| `OrderItem` | `quantity` >= 1; `food_name` and `unit_price` are snapshots; `line_total = unit_price x quantity` |
| `Delivery` | `order_id` unique; `rider_id` must reference a user with role `RIDER`; reassignment allowed until the order is Picked Up |
 
Foreign keys use `PROTECT` on `FoodItem`, `Restaurant`, and `User` references from orders so order history is never lost.
 
### 3.3 Relationships
 
| Relationship | Cardinality |
|---|---|
| User (owner) to Restaurant | 1 to 0..1 |
| User (customer) to Cart | 1 to 0..1 |
| User (customer) to Order | 1 to many |
| Restaurant to Category / Order | 1 to many |
| Category to FoodItem | 1 to many |
| Cart to CartItem | 1 to many |
| Order to OrderItem | 1 to 1..many |
| Order to Delivery | 1 to 0..1 |
| User (rider) to Delivery | 1 to many |
 
---
 
## 4. Order Workflow
 
### 4.1 Order Lifecycle
 
Colors show who performs each step.
 
```mermaid
flowchart LR
    classDef cust fill:#E8F0FE,stroke:#4285F4,color:#111
    classDef rest fill:#FEF7E0,stroke:#F9AB00,color:#111
    classDef rider fill:#E6F4EA,stroke:#34A853,color:#111
    classDef endbad fill:#FCE8E6,stroke:#EA4335,color:#111
    classDef endok fill:#CEEAD6,stroke:#188038,color:#111
 
    START(( )) --> P[Pending]:::cust
    P -->|Restaurant accepts| AC[Accepted]:::rest
    P -->|Restaurant rejects| RJ[Rejected]:::endbad
    P -->|Customer cancels| CN[Cancelled]:::endbad
    AC -->|Restaurant| PR[Preparing]:::rest
    PR -->|Restaurant| RP[Ready for Pickup]:::rest
    RP -->|"Admin assigns rider<br/>(no status change)"| RP
    RP -->|Rider| PU[Picked Up]:::rider
    PU -->|Rider| IT[In Transit]:::rider
    IT -->|"Rider + cash collected"| DL[Delivered<br/>payment = PAID]:::endok
```
 
| Legend | Actor |
|---|---|
| Blue | Customer |
| Yellow | Restaurant |
| Green | Rider |
| Red / dark green | Terminal states |
 
### 4.2 Allowed Transitions
 
| From | To | Performed by |
|---|---|---|
| Pending | Accepted, Rejected | Restaurant (owner) |
| Pending | Cancelled | Customer (order owner) |
| Accepted | Preparing | Restaurant (owner) |
| Preparing | Ready for Pickup | Restaurant (owner) |
| Ready for Pickup | Picked Up | Assigned rider |
| Picked Up | In Transit | Assigned rider |
| In Transit | Delivered | Assigned rider |
 
Anything else returns `400` (invalid transition) or `403` (not permitted). Put all transition logic in one service function so every endpoint uses the same rules.
 
### 4.3 Payment Status
 
| Method | Initial | Becomes `PAID` when |
|---|---|---|
| Cash on Delivery | `PENDING` | Rider marks Delivered with `cash_collected = true` |
 
If cash could not be collected, the rider marks Delivered without it; payment stays `PENDING` until an admin resolves it.
 
### 4.4 Checkout Sequence
 
```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant React
    participant API as DRF API
    participant DB as MySQL
 
    Customer->>React: Submit address, phone, COD
    React->>API: POST /api/orders/
    API->>API: Verify JWT and CUSTOMER role
    API->>DB: Read cart, items, current prices
    DB-->>API: Cart data
    API->>API: Check restaurant open, items available, calculate totals
    rect rgb(230, 244, 234)
        Note over API,DB: Single transaction (atomic)
        API->>DB: Create Order
        API->>DB: Create OrderItems (name + price snapshot)
        API->>DB: Clear cart
    end
    API-->>React: 201 Created + order
    React-->>Customer: Order confirmation
```
 
If any step fails, the transaction rolls back and no partial order is saved.
 
### 4.5 Delivery Sequence
 
```mermaid
sequenceDiagram
    autonumber
    actor Restaurant
    actor Admin
    actor Rider
    participant API as DRF API
    participant DB as MySQL
 
    Restaurant->>API: POST /restaurant/orders/{id}/ready/
    API->>DB: status = READY_FOR_PICKUP
    Admin->>API: POST /admin/orders/{id}/assign-rider/
    API->>DB: Create or update Delivery (rider, assigned_at)
    Rider->>API: GET /rider/deliveries/
    API-->>Rider: Assigned deliveries only
    Rider->>API: POST .../picked-up/
    API->>DB: status = PICKED_UP, picked_up_at
    Rider->>API: POST .../in-transit/
    API->>DB: status = IN_TRANSIT
    Rider->>API: POST .../delivered/ {cash_collected: true}
    API->>DB: status = DELIVERED, payment_status = PAID, delivered_at
```
 
---
 
## 5. API Design
 
All endpoints are prefixed with `/api/`, use JSON, and require `Authorization: Bearer <token>` unless marked Public.
 
### 5.1 Authentication
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register/` | Register a customer | Public |
| POST | `/auth/login/` | Get access and refresh tokens | Public |
| POST | `/auth/token/refresh/` | Refresh access token | Refresh token |
| POST | `/auth/logout/` | Blacklist refresh token | Authenticated |
| GET | `/auth/me/` | Current user and role | Authenticated |
 
Registration must never create restaurant, rider, or admin accounts.
 
### 5.2 Restaurants and Menu
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/restaurants/?search=` | List and search active restaurants | Public |
| GET | `/restaurants/{id}/` | Details with categories and food items | Public |
| PATCH | `/restaurants/my/` | Update own profile, open/closed | Restaurant |
| POST | `/categories/` | Create category | Restaurant |
| POST | `/food-items/` | Create food item | Restaurant |
| PATCH | `/food-items/{id}/` | Update own item or availability | Restaurant |
| DELETE | `/food-items/{id}/` | Soft delete own item | Restaurant |
 
### 5.3 Cart and Customer Orders
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/cart/` | View cart | Customer |
| POST | `/cart/items/` | Add item | Customer |
| PATCH | `/cart/items/{id}/` | Change quantity | Customer |
| DELETE | `/cart/items/{id}/` | Remove item | Customer |
| DELETE | `/cart/` | Clear cart | Customer |
| POST | `/orders/` | Checkout | Customer |
| GET | `/orders/` | Own order history | Customer |
| GET | `/orders/{id}/` | Own order details and status | Customer |
| POST | `/orders/{id}/cancel/` | Cancel a Pending order | Customer |
 
### 5.4 Restaurant Orders
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/restaurant/orders/` | Own restaurant's orders | Restaurant |
| POST | `/restaurant/orders/{id}/accept/` | Pending to Accepted | Restaurant |
| POST | `/restaurant/orders/{id}/reject/` | Pending to Rejected | Restaurant |
| POST | `/restaurant/orders/{id}/preparing/` | Accepted to Preparing | Restaurant |
| POST | `/restaurant/orders/{id}/ready/` | Preparing to Ready for Pickup | Restaurant |
 
### 5.5 Delivery
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/rider/deliveries/` | Own assigned deliveries | Rider |
| POST | `/rider/deliveries/{id}/picked-up/` | Ready to Picked Up | Assigned rider |
| POST | `/rider/deliveries/{id}/in-transit/` | Picked Up to In Transit | Assigned rider |
| POST | `/rider/deliveries/{id}/delivered/` | In Transit to Delivered, body `{cash_collected}` | Assigned rider |
| POST | `/rider/deliveries/{id}/issue/` | Report a problem, body `{note}` | Assigned rider |
 
### 5.6 Administration
 
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET / POST / PATCH | `/admin/users/` | Manage users, create restaurant and rider accounts | Admin |
| GET / PATCH | `/admin/restaurants/` | Manage and activate restaurants | Admin |
| GET | `/admin/orders/?status=&restaurant=` | Monitor all orders | Admin |
| GET | `/admin/riders/` | List riders with active delivery count | Admin |
| POST | `/admin/orders/{id}/assign-rider/` | Assign or reassign rider | Admin |
| GET | `/admin/dashboard/` | Statistics | Admin |
 
### 5.7 API Rules
 
- Use `200`, `201`, `400`, `401`, `403`, `404`, `409` appropriately.
- Error format: `{ "detail": "message" }`, with field errors under `errors`.
- Paginate all list endpoints.
- Never trust prices, totals, user IDs, or roles sent by the client.
- Filter every queryset by the authenticated user, so changing an ID in the URL cannot expose another user's data.
---
 
## 6. Authorization
 
Check **role** first, then **object ownership**.
 
| Action | Rule |
|---|---|
| View restaurants and menus | Public |
| Edit restaurant profile | Owner of that restaurant |
| Manage food items | Owner of the item's restaurant |
| View or edit cart | Cart's customer |
| View or cancel order | Order's customer |
| Process restaurant order | Owner of the order's restaurant |
| Assign rider, view all orders, dashboard | Admin |
| View or update delivery | Assigned rider (admin can view) |
 
Example: a restaurant owner must not be able to edit another restaurant's food item by changing the ID in the URL. Return `404` for objects the user may not see.
 
---
 
## 7. Frontend Design
 
### 7.1 Navigation by Role
 
```mermaid
flowchart LR
    classDef pub fill:#F1F3F4,stroke:#5F6368,color:#111
    classDef cust fill:#E8F0FE,stroke:#4285F4,color:#111
    classDef rest fill:#FEF7E0,stroke:#F9AB00,color:#111
    classDef rider fill:#E6F4EA,stroke:#34A853,color:#111
    classDef adm fill:#F3E8FD,stroke:#A142F4,color:#111
 
    HOME[Home / Restaurant list]:::pub --> MENU[Restaurant menu]:::pub
    LOGIN[Login / Register]:::pub -->|"role from /auth/me/"| ROLE{Role?}
 
    ROLE -->|CUSTOMER| C1[Cart]:::cust --> C2[Checkout]:::cust --> C3[My orders]:::cust --> C4[Order status]:::cust
    ROLE -->|RESTAURANT| R1[Dashboard]:::rest --> R2[Incoming orders]:::rest
    R1 --> R3[Menu manager]:::rest
    R1 --> R4[Restaurant profile]:::rest
    ROLE -->|RIDER| D1[My deliveries]:::rider --> D2[Delivery details]:::rider
    ROLE -->|ADMIN| A1[Dashboard]:::adm
    A1 --> A2[Ready orders and assignment]:::adm
    A1 --> A3[All orders]:::adm
    A1 --> A4[Users and restaurants]:::adm
```
 
### 7.2 Pages per Role
 
| Role | Pages |
|---|---|
| Public | Home, restaurant list, restaurant menu, login, register |
| Customer | Cart, checkout, my orders, order details/status |
| Restaurant | Dashboard, incoming orders, menu manager (categories and food items), profile |
| Rider | My deliveries, delivery details with status buttons |
| Admin | Dashboard, ready orders and rider assignment, all orders, users, restaurants |
 
### 7.3 Folder Structure
 
```text
frontend/src/
├── api/          client.js (Axios, token handling)
├── components/   Navbar, ProtectedRoute, StatusBadge
├── pages/        auth/ customer/ restaurant/ rider/ admin/
├── context/      AuthContext
└── App.jsx       routes
```
 
### 7.4 Access Control
 
- `ProtectedRoute` redirects users to the dashboard of their own role.
- Show only navigation relevant to the current role.
- Route protection is a convenience only; the backend enforces all permissions.
- Order status updates in the UI must show only the buttons valid for the current status.
---
 
## 8. Technical Rules
 
1. Set `AUTH_USER_MODEL` to the custom user **before the first migration**.
2. Use `DecimalField` for all money values.
3. Use Django's password hashing and a maintained JWT package (for example, `djangorestframework-simplejwt`).
4. Wrap checkout in `transaction.atomic()`.
5. Calculate prices on the backend from current database prices.
6. Validate every status transition on the backend using one shared function.
7. Add database constraints (unique, check) in addition to serializer validation.
8. Never hard-delete restaurants or food items referenced by orders.
9. Keep secrets and database credentials in environment variables.
10. Restrict CORS to the frontend origin.
---
 
## 9. Decisions to Confirm
 
The recommended choices are already applied in this document. The team should confirm or change them before implementation.
 
| # | Decision | Applied choice |
|---|---|---|
| 1 | One restaurant per owner | Yes |
| 2 | Restaurant staff accounts | No, owner only |
| 3 | Who creates restaurant and rider accounts | Admin |
| 4 | Item from a second restaurant | Reject (`409`), clear cart first |
| 5 | Delivery fee | Fixed setting, default `0` |
| 6 | COD marked paid | When the rider confirms cash collected |
| 7 | Cancel after acceptance | Not allowed |
| 8 | Rider updating an unassigned order | Not allowed |
| 9 | Rider capacity for assignment | Admin decides; UI shows active delivery count |
 
Record any change here and update the SRS requirement IDs affected.
 
---
 
## 10. Out of Scope
 
Online payments, live GPS tracking, WebSockets and push notifications, coupons and recommendations, ratings and reviews, advanced analytics and rider earnings, multi-restaurant checkout, and restaurant staff accounts.
 
---
 
## 11. Phase 2 Completion Checklist
 
- [ ] Both members can explain the architecture and module boundaries.
- [ ] ERD reviewed: keys, relationships, and cardinalities agreed.
- [ ] Section 9 decisions confirmed.
- [ ] Order lifecycle, transitions, and payment behavior agreed.
- [ ] API endpoint list and request/response fields agreed.
- [ ] Role and object-level permissions agreed.
- [ ] Low-fidelity wireframes sketched for customer, restaurant, rider, and admin pages.
**Phase 2 is complete when both members can explain, with the tables and endpoints involved, how a customer places an order, how the restaurant processes it, how an admin assigns a rider, and how the rider completes the delivery.**
 
### Next Step
 
Move to Phase 3: project setup, MySQL configuration, custom user model, and JWT authentication. Build in vertical slices (auth, menu, order, delivery, admin) rather than generating all models and pages at once.
 