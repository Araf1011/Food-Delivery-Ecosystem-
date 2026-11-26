import { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function Checkout({
  cartItems,
  initialAddress = '',
  onClose,
  onOrderPlaced,
}) {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 2.0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a contact phone number for the rider.');
      return;
    }
    setError('');
    const orderId = `FD-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      id: orderId,
      address: address.trim(),
      paymentMethod,
      total: total.toFixed(2),
      itemCount: cartItems.reduce((sum, i) => sum + i.qty, 0),
    });
    onOrderPlaced?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FFFDF8]">
          <div className="flex items-center gap-2.5">
            {!confirmedOrder && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Back"
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-lg font-bold text-[#111111]">
              {confirmedOrder ? 'Order Confirmed' : 'Checkout'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-7 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Status: Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-[#111111] mt-3">
                Thank you! Order #{confirmedOrder.id}
              </h3>
              <p className="text-sm text-stone-500 mt-1.5 max-w-md mx-auto">
                The restaurant has received your order ({confirmedOrder.itemCount}{' '}
                {confirmedOrder.itemCount === 1 ? 'item' : 'items'}) and will begin
                preparing it shortly.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Deliver to</span>
                <span className="font-semibold text-stone-800 text-right">
                  {confirmedOrder.address}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Payment Method</span>
                <span className="font-semibold text-stone-800">
                  {confirmedOrder.paymentMethod === 'cod'
                    ? 'Cash on Delivery (Unpaid)'
                    : 'Online Payment (Paid)'}
                </span>
              </div>
              <div className="flex justify-between gap-4 pt-2 border-t border-stone-200">
                <span className="text-stone-600 font-medium">
                  {confirmedOrder.paymentMethod === 'cod'
                    ? 'Cash Due on Delivery'
                    : 'Total Paid'}
                </span>
                <span className="font-extrabold text-[#DF1111]">
                  ${confirmedOrder.total}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="bg-[#DF1111] hover:bg-[#C50E0E] text-white text-sm font-semibold px-8 py-3 rounded-xl shadow-sm transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Delivery Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DF1111]" />
                Delivery Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 42 Lakeview Road, Apt 4B"
                    required
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    required
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Delivery Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Call upon arrival"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#111111]">
                Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`text-left p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-[#DF1111] bg-[#FFF8F6]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === 'cod'
                        ? 'bg-[#DF1111] text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                      Pay cash to the rider at your doorstep. No advance payment.
                    </p>
                  </div>
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`text-left p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'online'
                      ? 'border-[#DF1111] bg-[#FFF8F6]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === 'online'
                        ? 'bg-[#DF1111] text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">
                      Online Payment
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                      Pay securely in advance via Card or Digital Wallet.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">Free</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-[#111111] text-base pt-2 border-t border-stone-200">
                <span>
                  {paymentMethod === 'cod' ? 'Cash Due on Delivery' : 'Total'}
                </span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {paymentMethod === 'cod'
                  ? 'Order confirms immediately — pay when delivered'
                  : '256-bit encrypted checkout'}
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#DF1111] hover:bg-[#C50E0E] text-white text-sm font-semibold px-7 py-3 rounded-xl shadow-[0_4px_14px_rgba(223,17,17,0.25)] transition cursor-pointer"
              >
                {paymentMethod === 'cod'
                  ? `Place COD Order ($${total.toFixed(2)})`
                  : `Pay & Place Order ($${total.toFixed(2)})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
