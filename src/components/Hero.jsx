import { useState } from 'react';
import { Package, CheckCircle2 } from 'lucide-react';

export default function Hero({ onFindRestaurant }) {
  const [address, setAddress] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) return;
    setSubmittedAddress(trimmed);
    onFindRestaurant?.(trimmed);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6">
          {/* Left Copy & CTA */}
          <div className="lg:col-span-6 space-y-6 z-10">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 border border-stone-200/80 rounded-full px-3.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Package className="w-3.5 h-3.5 text-[#A85B32]" />
              <span className="text-xs font-semibold text-[#8E2424] tracking-tight">
                Fastest Delivery &amp; Easy Pickup
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.45rem] font-extrabold text-[#111111] leading-[1.11] tracking-[-0.025em]">
              Hot Meals,
              <br />
              Quick Bites &amp;
              <br />
              Memorable Flavor
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-stone-500 max-w-md leading-relaxed">
              Discover the best foods from over 1,000 restaurants and fast
              delivery to your doorstep
            </p>

            {/* Address Search Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg pt-1"
            >
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                aria-label="Enter your delivery address"
                className="flex-1 bg-white border border-stone-200/90 rounded-lg px-4 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-red-500/10 transition"
              />
              <button
                type="submit"
                className="bg-[#DF1111] hover:bg-[#C50E0E] active:scale-[0.99] text-white text-sm font-semibold rounded-lg px-6 py-3.5 shadow-[0_4px_14px_rgba(223,17,17,0.25)] transition cursor-pointer shrink-0"
              >
                Find Restaurant
              </button>
            </form>

            {submittedAddress && (
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg px-3.5 py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Showing 48+ restaurants delivering near{' '}
                  <strong className="font-semibold">{submittedAddress}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Right Hero Food Visual */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[580px] lg:max-w-[640px] lg:-mr-8">
              <img
                src="/images/hero-bowl.jpg"
                alt="Fresh healthy bowl with roasted sweet potato, sliced avocado, snap peas, and caramelized mushrooms"
                className="w-full h-auto object-contain mix-blend-multiply brightness-[1.03] contrast-[1.03] select-none pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
