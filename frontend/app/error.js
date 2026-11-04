'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-sm text-brand-mutedGray mt-2">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="btn-primary mt-8">Try again</button>
    </div>
  );
}
