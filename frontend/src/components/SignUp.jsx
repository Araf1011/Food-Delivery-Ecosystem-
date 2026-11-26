import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function SignUp({ onSwitchToLogin, onBackHome, onSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms & Privacy Policy to continue.');
      return;
    }
    setError('');
    onSuccess?.({ fullName: fullName.trim(), email: email.trim() });
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col justify-between px-4 py-8 sm:px-6">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#111111] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={onBackHome}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-[#DF1111] flex items-center justify-center shadow-xs">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/95 block" />
          </span>
          <span className="text-[17px] font-bold tracking-[0.06em] text-[#181818]">
            FOODLY
          </span>
        </button>
      </div>

      {/* Centered Card */}
      <div className="w-full max-w-md mx-auto my-8 bg-white rounded-2xl border border-stone-200/80 shadow-[0_14px_40px_rgba(0,0,0,0.06)] p-7 sm:p-9">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-[#111111] tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-stone-500 mt-1.5">
            Join Foodly and order from over 1,000 restaurants
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Foyez Ahmed Nirob"
                required
                className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-red-500/10 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-red-500/10 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 chars)"
                required
                className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-10 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-red-500/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-red-500/10 transition"
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer select-none pt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-stone-300 accent-[#DF1111]"
            />
            <span>
              I agree to Foodly&apos;s{' '}
              <span className="font-medium text-stone-800 underline">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="font-medium text-stone-800 underline">
                Privacy Policy
              </span>
              .
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#DF1111] hover:bg-[#C50E0E] active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-lg shadow-[0_4px_14px_rgba(223,17,17,0.25)] transition cursor-pointer mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-xs sm:text-sm text-stone-500 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-[#DF1111] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>

      <p className="text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Foodly. Fast delivery to your doorstep.
      </p>
    </div>
  );
}
