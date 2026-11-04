'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { login, register } from '@/lib/session';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Feedback';

const CONFIG = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to track orders and check out faster.',
    submit: 'Log In',
    switchText: "Don't have an account?",
    switchLabel: 'Create one',
    switchHref: '/register',
  },
  register: {
    title: 'Join the brotherhood',
    subtitle: 'Create an account to save your cart and track your orders.',
    submit: 'Create Account',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
};

// Only allow same-site relative redirects (prevents open-redirects)
const safeRedirect = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/');

export default function AuthForm({ mode }) {
  const cfg = CONFIG[mode];
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get('redirect'));
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → skip the form
  useEffect(() => {
    if (token && !submitting) router.replace(redirect);
  }, [token, submitting, redirect, router]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (mode === 'register' && form.name.trim().length < 2) next.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user =
        mode === 'login'
          ? await login({ email: form.email, password: form.password })
          : await register(form);
      toast.success(mode === 'login' ? `Welcome back, ${user.name.split(' ')[0]}` : 'Account created');
      router.replace(redirect);
    } catch (err) {
      if (err.errors) {
        setErrors(Object.fromEntries(err.errors.map((x) => [x.field, x.message])));
      }
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const field = (key, label, type = 'text', autoComplete) => (
    <div>
      <label htmlFor={key} className="label">
        {label}
      </label>
      <input
        id={key}
        type={type}
        value={form[key]}
        onChange={set(key)}
        autoComplete={autoComplete}
        className={`input ${errors[key] ? '!border-red-500' : ''}`}
      />
      {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="container-page py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">GRVTY Account</span>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">{cfg.title}</h1>
          <p className="text-sm text-brand-mutedGray mt-2">{cfg.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-brand-border rounded-md p-6 sm:p-8" noValidate>
          {mode === 'register' && field('name', 'Full name', 'text', 'name')}
          {field('email', 'Email', 'email', 'email')}
          {field('password', 'Password', 'password', mode === 'login' ? 'current-password' : 'new-password')}

          <button type="submit" disabled={submitting} className="btn-primary w-full !mt-6">
            {submitting ? <Spinner /> : cfg.submit}
          </button>
        </form>

        <p className="text-center text-sm text-brand-slate mt-6">
          {cfg.switchText}{' '}
          <Link
            href={`${cfg.switchHref}${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-brand-blue hover:text-brand-blueDark"
          >
            {cfg.switchLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
