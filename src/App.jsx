import { useState } from 'react';
import { X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularCategories from './components/PopularCategories';
import Login from './components/Login';
import SignUp from './components/SignUp';

const INITIAL_CART = [
  { id: 1, name: 'Harvest Sweet Potato Bowl', price: 14.5, qty: 1 },
  { id: 2, name: 'Crispy Chicken Burger', price: 11.0, qty: 1 },
];

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'signup'
  const [activeNav, setActiveNav] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

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
      {/* Top Hero Wrapper with warm cream-to-white gradient */}
      <div className="hero-gradient">
        <Navbar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={cartCount}
          onCartClick={() => setShowCart(true)}
          onSignInClick={() => setView('login')}
          user={user}
          onSignOut={() => setUser(null)}
        />
        <Hero />
      </div>

      {/* Popular Categories Section */}
      <main>
        <PopularCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
        />
      </main>

      {/* Cart Drawer / Modal */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex justify-end"
          onClick={() => setShowCart(false)}
        >
          <div
            className="w-full max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
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
                  Your bag is empty.
                </p>
              ) : (
                <ul className="divide-y divide-stone-100 mt-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="py-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          Qty: {item.qty} &middot; ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCartItems((prev) =>
                            prev.filter((c) => c.id !== item.id)
                          )
                        }
                        className="text-xs text-stone-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="w-full bg-[#DF1111] hover:bg-[#C50E0E] text-white text-sm font-semibold py-3 rounded-lg transition cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
