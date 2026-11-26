import { ArrowLeft, Clock, Minus, Plus, Star, ShoppingBag } from 'lucide-react';

export default function RestaurantMenu({
  restaurant,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onBack,
  onOpenCart,
}) {
  const getItemQty = (dishId) => {
    const found = cartItems.find((item) => item.id === dishId);
    return found ? found.qty : 0;
  };

  return (
    <section className="bg-[#FAFAFA] min-h-[calc(100vh-5rem)] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#111111] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Restaurants</span>
          </button>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 bg-[#DF1111] hover:bg-[#C50E0E] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Order ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
            </button>
          )}
        </div>

        {/* Restaurant Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 h-52 md:h-auto bg-stone-100">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Open Now
                  </span>
                  {restaurant.deliveryFee === 0 && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-[#DF1111]">
                      Free Delivery
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                  {restaurant.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-stone-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {restaurant.rating}{' '}
                    <span className="font-normal text-stone-400">
                      ({restaurant.reviews} reviews)
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    {restaurant.deliveryTime}
                  </span>
                  <span>
                    Delivery:{' '}
                    <strong className="text-stone-800">
                      {restaurant.deliveryFee === 0
                        ? 'Free'
                        : `$${restaurant.deliveryFee.toFixed(2)}`}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <h2 className="text-lg sm:text-xl font-bold text-[#111111] mb-5">
          Menu ({restaurant.menu.length} items)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {restaurant.menu.map((dish) => {
            const qty = getItemQty(dish.id);
            return (
              <div
                key={dish.id}
                className={`bg-white rounded-2xl border border-stone-200/80 p-4 flex gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${
                  !dish.available ? 'opacity-65' : ''
                }`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#111111] leading-snug">
                        {dish.name}
                      </h3>
                      {!dish.available && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 shrink-0">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 pt-2">
                    <span className="text-sm sm:text-base font-extrabold text-[#111111]">
                      ${dish.price.toFixed(2)}
                    </span>

                    {dish.available &&
                      (qty === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onAddToCart({
                              id: dish.id,
                              name: dish.name,
                              price: dish.price,
                              image: dish.image,
                              restaurantName: restaurant.name,
                            })
                          }
                          className="inline-flex items-center gap-1.5 bg-[#DF1111] hover:bg-[#C50E0E] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(dish.id, qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-md bg-white hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-stone-900 min-w-[18px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(dish.id, qty + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-md bg-[#DF1111] hover:bg-[#C50E0E] flex items-center justify-center text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
