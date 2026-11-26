import { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = ['Home', 'Menu', 'Restaurants', 'About'];

const MENU_CATEGORIES = [
  { id: 'burger', label: 'Burger' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'noodles', label: 'Noodles' },
  { id: 'sandwich', label: 'Sandwich' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'healthy', label: 'Healthy' },
];

export default function Navbar({
  activeNav,
  onNavChange,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onCartClick,
  onSignInClick,
  user,
  onSignOut,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryClick = (categoryId) => {
    onSelectCategory?.(categoryId);
    onNavChange('Menu');
    setMobileOpen(false);
    document
      .getElementById('categories')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="w-full relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavChange('Home');
          }}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <span className="w-7 h-7 rounded-full bg-[#DF1111] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/95 block" />
          </span>
          <span className="text-[17px] font-bold tracking-[0.06em] text-[#181818]">
            FOODLY
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => {
            const isActive = activeNav === item;

            if (item === 'Menu') {
              return (
                <div key={item} className="relative group py-2">
                  <a
                    href="#menu"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavChange(item);
                    }}
                    className={`inline-flex items-center gap-1 text-sm transition-colors ${
                      isActive
                        ? 'text-[#111111] font-semibold'
                        : 'text-stone-500 font-medium group-hover:text-[#111111]'
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </a>

                  {/* Hover Categories Dropdown */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 z-40">
                    <div className="w-60 bg-white rounded-2xl border border-stone-200/85 shadow-[0_14px_36px_rgba(0,0,0,0.08)] p-2.5">
                      <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Categories
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {MENU_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className="text-left px-2.5 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-stone-700 hover:bg-[#FFF5EC] hover:text-[#DF1111] transition-colors cursor-pointer"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavChange(item);
                }}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-[#111111] font-semibold'
                    : 'text-stone-500 font-medium hover:text-[#111111]'
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="hidden sm:flex items-center bg-white/90 border border-stone-200/90 rounded-full px-3.5 py-2 w-44 lg:w-52 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus-within:border-stone-400 transition-colors">
            <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              aria-label="Search foods or restaurants"
              className="w-full bg-transparent text-xs sm:text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {/* Sign In / User Button */}
          {user ? (
            <button
              type="button"
              onClick={onSignOut}
              title="Click to sign out"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/90 hover:bg-white border border-stone-200/90 rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-stone-300 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#DF1111]" />
              <span className="max-w-[110px] truncate">
                {user.fullName || user.email.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignInClick}
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/90 hover:bg-white border border-stone-200/90 rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-stone-300 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-stone-700" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            type="button"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative p-2 rounded-full hover:bg-stone-100/80 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-stone-800" strokeWidth={1.9} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#DF1111] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-stone-800" />
            ) : (
              <Menu className="w-5 h-5 text-stone-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200/70 px-4 py-4 space-y-3 shadow-md">
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-full px-3.5 py-2">
            <Search className="w-4 h-4 text-stone-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavChange(item);
                  setMobileOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm ${
                  activeNav === item
                    ? 'bg-stone-100 text-[#111111] font-semibold'
                    : 'text-stone-600 font-medium hover:bg-stone-50'
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onSignInClick();
            }}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white rounded-full py-2.5 text-sm font-medium cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      )}
    </header>
  );
}
