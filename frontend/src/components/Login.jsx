import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login({ onSwitchToSignUp, onBackHome, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }
    setError('');
    onSuccess?.({ email: email.trim() });
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
      <div className="w-full max-w-md mx-auto my-10 bg-white rounded-2xl border border-stone-200/80 shadow-[0_14px_40px_rgba(0,0,0,0.06)] p-7 sm:p-9">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-[#111111] tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-stone-500 mt-1.5">
            Sign in to your Foodly account to order your favorites
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-email"
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
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-stone-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setError('Password reset link sent if account exists.')}
                className="text-xs font-medium text-[#DF1111] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          {/* Remember Me */}
          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none pt-0.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 accent-[#DF1111]"
            />
            <span>Keep me signed in</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#DF1111] hover:bg-[#C50E0E] active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-lg shadow-[0_4px_14px_rgba(223,17,17,0.25)] transition cursor-pointer mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-stone-400">or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSuccess?.({ email: 'google-user@foodly.app' })}
            className="flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-lg py-2.5 text-xs font-semibold text-stone-700 transition cursor-pointer"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => onSuccess?.({ email: 'apple-user@foodly.app' })}
            className="flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-lg py-2.5 text-xs font-semibold text-stone-700 transition cursor-pointer"
          >
            <span>Apple</span>
          </button>
        </div>

        {/* Switch to Sign Up */}
        <p className="text-center text-xs sm:text-sm text-stone-500 mt-6">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-[#DF1111] hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>

      <p className="text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Foodly. Fast delivery to your doorstep.
      </p>
    </div>
  );
}
