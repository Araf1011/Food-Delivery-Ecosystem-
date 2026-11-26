import { Clock, Star, ArrowRight } from 'lucide-react';
import { RESTAURANTS } from '../data/restaurants';

export default function FeaturedRestaurants({
  selectedCategory,
  searchQuery,
  onClearFilter,
  onSelectRestaurant,
}) {
  const query = searchQuery.trim().toLowerCase();

  const filtered = RESTAURANTS.filter((rest) => {
    const matchesCategory =
      !selectedCategory || rest.categories.includes(selectedCategory);

    const matchesQuery =
      !query ||
      rest.name.toLowerCase().includes(query) ||
      rest.tags.some((t) => t.toLowerCase().includes(query)) ||
      rest.menu.some((m) => m.name.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="restaurants" className="bg-[#FAFAFA] py-12 sm:py-16 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#181818] tracking-tight">
              {selectedCategory
                ? `Top ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Spots`
                : 'Featured Restaurants'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Handpicked kitchens delivering hot and fresh near you
            </p>
          </div>

          {(selectedCategory || query) && (
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs font-semibold text-[#DF1111] bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-full transition cursor-pointer"
            >
              Clear filter ({filtered.length} shown)
            </button>
          )}
        </div>

        {/* Restaurant Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-10 text-center">
            <p className="text-sm font-medium text-stone-600">
              No restaurants found matching your current filter.
            </p>
            <button
              type="button"
              onClick={onClearFilter}
              className="mt-3 text-xs font-semibold text-[#DF1111] hover:underline cursor-pointer"
            >
              Show all restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant) => (
              <button
                key={restaurant.id}
                type="button"
                onClick={() => onSelectRestaurant(restaurant)}
                className="group text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs ${
                        restaurant.deliveryFee === 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 text-stone-800'
                      }`}
                    >
                      {restaurant.deliveryFee === 0
                        ? 'Free Delivery'
                        : `$${restaurant.deliveryFee.toFixed(2)} Delivery`}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-stone-800">
                      {restaurant.rating}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ({restaurant.reviews})
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#111111] group-hover:text-[#DF1111] transition-colors">
                        {restaurant.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#DF1111] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {restaurant.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1.5 font-medium text-stone-700">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className="font-semibold text-[#DF1111]">
                      View Menu
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
