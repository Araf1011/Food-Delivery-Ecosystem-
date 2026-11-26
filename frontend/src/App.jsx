import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularCategories from './components/PopularCategories';
import FeaturedRestaurants from './components/FeaturedRestaurants';
import RestaurantMenu from './components/RestaurantMenu';
import Checkout from './components/Checkout';
import Login from './components/Login';
import SignUp from './components/SignUp';

const INITIAL_CART = [
  { id: 'gb-1', name: 'Harvest Sweet Potato Bowl', price: 14.5, qty: 1 },
  { id: 'sb-2', name: 'Crispy Chicken Burger', price: 11.0, qty: 1 },
];

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'signup'
  const [activeNav, setActiveNav] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  const handleAddToCart = (dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const handleUpdateQty = (dishId, nextQty) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== dishId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === dishId ? { ...item, qty: nextQty } : item))
    );
  };

  const handleNavChange = (nav) => {
    setActiveNav(nav);
    setSelectedRestaurant(null);
    if (nav === 'Restaurants') {
      setTimeout(() => {
        document
          .getElementById('restaurants')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  if (view === 'login') {
    return (
      <Login
        onSwitchToSignUp={() => setView('signup')}
        onBackHome={() => setView('home')}
        onSuccess={(userData) => {
          setUser(userData);
          setView('home');
        }}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignUp
        onSwitchToLogin={() => setView('login')}
        onBackHome={() => setView('home')}
        onSuccess={(userData) => {
          setUser(userData);
          setView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {/* Top Navbar + Hero */}
      <div className="hero-gradient">
        <Navbar
          activeNav={activeNav}
          onNavChange={handleNavChange}
          onSelectCategory={(catId) => {
            setSelectedRestaurant(null);
            setSelectedCategory(catId);
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSelectedRestaurant(null);
            setSearchQuery(q);
          }}
          cartCount={cartCount}
          onCartClick={() => setShowCart(true)}
          onSignInClick={() => setView('login')}
          user={user}
          onSignOut={() => setUser(null)}
        />
        {!selectedRestaurant && (
          <Hero
            onFindRestaurant={(addr) => {
              setDeliveryAddress(addr);
              document
                .getElementById('restaurants')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <main>
        {selectedRestaurant ? (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onBack={() => setSelectedRestaurant(null)}
            onOpenCart={() => setShowCart(true)}
          />
        ) : (
          <>
            <PopularCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
            />
            <FeaturedRestaurants
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onClearFilter={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              onSelectRestaurant={(rest) => {
                setSelectedRestaurant(rest);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Cart Drawer */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex justify-end"
          onClick={() => setShowCart(false)}
        >
          <div
            className="w-full max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-lg font-bold text-[#111111]">
                  Your Order ({cartCount})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  aria-label="Close cart"
                  className="p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-sm text-stone-500 mt-8 text-center">
                  Your bag is empty. Add dishes from any restaurant!
                </p>
              ) : (
                <ul className="divide-y divide-stone-100 mt-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="py-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center gap-1.5 bg-stone-100 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-md bg-white hover:bg-stone-50 flex items-center justify-center text-stone-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold min-w-[16px] text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-md bg-[#DF1111] hover:bg-[#C50E0E] flex items-center justify-center text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full bg-[#DF1111] hover:bg-[#C50E0E] text-white text-sm font-semibold py-3 rounded-lg transition cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal (COD + Online Payment) */}
      {showCheckout && (
        <Checkout
          cartItems={cartItems}
          initialAddress={deliveryAddress}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={() => setCartItems([])}
        />
      )}
    </div>
  );
}
