import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signIn } from '../api/user';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (signInError) {
      setError(signInError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#17211b] lg:grid lg:grid-cols-[minmax(320px,0.85fr)_minmax(520px,1.15fr)]">
      <section className="relative hidden overflow-hidden bg-[#173b32] px-12 py-12 text-[#f6f2e9] lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#d6e1c5]/20" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-[#d6e1c5]/15" />

        <div className="relative">
          <div className="mb-20 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6e1c5] text-lg font-bold text-[#173b32]">M</span>
            <span className="text-lg font-semibold tracking-[0.18em]">MANMOHEY</span>
          </div>
          <p className="mb-5 max-w-sm text-sm font-medium uppercase tracking-[0.22em] text-[#d6e1c5]">Commerce, thoughtfully managed</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.03em] xl:text-6xl">A clearer view of everything you sell.</h1>
        </div>

        <div className="relative max-w-sm border-l border-[#d6e1c5]/40 pl-5 text-sm leading-6 text-[#d6e1c5]/80">
          <p>Keep products, customers, orders, and categories moving in one calm workspace.</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173b32] text-lg font-bold text-[#d6e1c5]">M</span>
              <span className="text-lg font-semibold tracking-[0.18em]">MANMOHEY</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b26b3f]">Admin portal</p>
            <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#173b32]">Welcome back.</h2>
            <p className="mt-3 text-base text-[#66736b]">Sign in to continue to your workspace.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#33443a]" htmlFor="email">Email address</label>
              <input
                className="w-full rounded-lg border border-[#d6d8ce] bg-white px-4 py-3 text-[#173b32] outline-none transition placeholder:text-[#a6ada6] focus:border-[#b26b3f] focus:ring-2 focus:ring-[#b26b3f]/20"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@manmohey.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label className="block text-sm font-semibold text-[#33443a]" htmlFor="password">Password</label>
                <a className="text-sm font-semibold text-[#b26b3f] transition hover:text-[#8e4e2d]" href="#forgot-password">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-[#d6d8ce] bg-white px-4 py-3 pr-20 text-[#173b32] outline-none transition placeholder:text-[#a6ada6] focus:border-[#b26b3f] focus:ring-2 focus:ring-[#b26b3f]/20"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.12em] text-[#66736b] hover:text-[#173b32]"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-[#66736b]">
              <input className="h-4 w-4 rounded border-[#c6ccc4] text-[#b26b3f] focus:ring-[#b26b3f]" type="checkbox" name="remember" />
              Keep me signed in
            </label>

            {error && (
              <p className="rounded-lg border border-[#e4b9a5] bg-[#fff2ec] px-4 py-3 text-sm text-[#984f2f]" role="alert">
                {error}
              </p>
            )}

            <button className="w-full rounded-lg bg-[#b26b3f] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#984f2f] focus:outline-none focus:ring-2 focus:ring-[#b26b3f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in to Manmohey'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#7a847d]">Need access? Contact your account administrator.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;