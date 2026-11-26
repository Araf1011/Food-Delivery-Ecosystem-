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
            className="group flex items-center justify-center gap-2.5 bg-white border border-stone-200/90 hover:border-stone-300 hover:bg-stone-50/70 rounded-xl py-3 px-4 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => onSuccess?.({ email: 'apple-user@foodly.app' })}
            className="group flex items-center justify-center gap-2.5 bg-[#111111] hover:bg-[#1E1E1E] border border-[#111111] rounded-xl py-3 px-4 text-xs sm:text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0 fill-current -mt-0.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43Zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45Z" />
            </svg>
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
