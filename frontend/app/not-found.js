import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-bebas text-8xl tracking-wide text-brand-blue">404</p>
      <h1 className="text-2xl font-semibold tracking-tight mt-2">Page not found</h1>
      <p className="text-sm text-brand-mutedGray mt-2">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="flex justify-center gap-3 mt-8">
        <Link href="/" className="btn-outline">Go Home</Link>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </div>
    </div>
  );
}
