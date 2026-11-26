import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import burgerImg from '../assets/category pic/burger.jpg';
import pizzaImg from '../assets/category pic/pizza.jpg';
import chickenImg from '../assets/category pic/chicken.jpg';
import noodlesImg from '../assets/category pic/noodles.jpg';
import dessertImg from '../assets/category pic/dessert.jpg';
import coffeeImg from '../assets/category pic/coffee.jpg';
import healthyImg from '../assets/category pic/healthy.jpg';

const CATEGORIES = [
  { id: 'burger', label: 'Burger', image: burgerImg, bg: 'bg-[#FFF0DC]' },
  { id: 'pizza', label: 'Pizza', image: pizzaImg, bg: 'bg-[#FFE9EE]' },
  { id: 'chicken', label: 'Chicken', image: chickenImg, bg: 'bg-[#FFF8D6]' },
  { id: 'noodles', label: 'Noodles', image: noodlesImg, bg: 'bg-[#FFEFF3]' },
  { id: 'sandwich', label: 'Sandwich', emoji: '🥪', bg: 'bg-[#FFF7D4]' },
  { id: 'dessert', label: 'Dessert', image: dessertImg, bg: 'bg-[#FFEBF2]' },
  { id: 'coffee', label: 'Coffee', image: coffeeImg, bg: 'bg-[#FFF0DC]' },
  { id: 'healthy', label: 'Healthy', image: healthyImg, bg: 'bg-[#E3FBE8]' },
  { id: 'sushi', label: 'Sushi', emoji: '🍣', bg: 'bg-[#FFEFE8]' },
  { id: 'tacos', label: 'Tacos', emoji: '🌮', bg: 'bg-[#FFF6D6]' },
  { id: 'seafood', label: 'Seafood', emoji: '🍤', bg: 'bg-[#E6F4FF]' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤', bg: 'bg-[#F3EAFF]' },
];

const VISIBLE_COUNT = 8;

export default function PopularCategories({
  selectedCategory,
  onSelectCategory,
  searchQuery,
}) {
  const [startIndex, setStartIndex] = useState(0);

  const filtered = searchQuery.trim()
    ? CATEGORIES.filter((cat) =>
        cat.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : CATEGORIES;

  const maxStart = Math.max(0, filtered.length - VISIBLE_COUNT);
  const safeStart = Math.min(startIndex, maxStart);
  const visibleCategories = searchQuery.trim()
    ? filtered
    : filtered.slice(safeStart, safeStart + VISIBLE_COUNT);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 2));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStart, prev + 2));
  };

  return (
    <section id="categories" className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#181818] tracking-tight">
            Popular Categories
          </h2>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={safeStart === 0}
              aria-label="Previous categories"
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-stone-400 hover:text-stone-900 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={safeStart >= maxStart}
              aria-label="Next categories"
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:border-stone-400 hover:text-stone-900 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Row */}
        {visibleCategories.length === 0 ? (
          <p className="text-sm text-stone-500 py-6">
            No categories match &ldquo;{searchQuery}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {visibleCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    onSelectCategory(isSelected ? null : cat.id)
                  }
                  className="group flex flex-col items-center gap-3 focus:outline-none cursor-pointer"
                >
                  <div
                    className={`w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] rounded-full overflow-hidden ${cat.bg} flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${
                      isSelected
                        ? 'ring-2 ring-[#DF1111] ring-offset-2 scale-105'
                        : ''
                    }`}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span
                        className="text-2xl sm:text-[28px] select-none"
                        role="img"
                        aria-label={cat.label}
                      >
                        {cat.emoji}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-[13px] transition-colors ${
                      isSelected
                        ? 'font-semibold text-[#DF1111]'
                        : 'font-medium text-stone-700 group-hover:text-[#111111]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
