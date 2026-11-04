'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import RequireAuth from '@/components/auth/RequireAuth';
import { useCartStore, selectSubtotal } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { usePlaceOrder } from '@/lib/accountQueries';
import { formatPrice, shippingFor } from '@/lib/format';
import FreeShippingBar from '@/components/cart/FreeShippingBar';
import { EmptyState, Spinner } from '@/components/ui/Feedback';

const FIELDS = [
  { key: 'fullName', label: 'Full name', autoComplete: 'name', span: 2 },
  { key: 'phone', label: 'Phone', autoComplete: 'tel', placeholder: '03XX XXXXXXX' },
  { key: 'city', label: 'City', autoComplete: 'address-level2' },
  { key: 'address', label: 'Street address', autoComplete: 'street-address', span: 2 },
  { key: 'postalCode', label: 'Postal code (optional)', autoComplete: 'postal-code' },
];

const validate = (form) => {
  const errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = 'Please enter your full name';
  if (!/^[+\d][\d\s-]{6,18}$/.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number';
  if (form.address.trim().length < 5) errors.address = 'Please enter your street address';
  if (form.city.trim().length < 2) errors.city = 'Please enter your city';
  return errors;
};

function Checkout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const loadServerCart = useCartStore((s) => s.loadServerCart);
  const clearLocal = useCartStore((s) => s.clearLocal);
  const placeOrder = usePlaceOrder();

  const [syncing, setSyncing] = useState(true);
  const [errors, setErrors] = useState({});
  const [notes, setNotes] = useState('');
  const [form, setForm] = useState({
    fullName: user?.shippingAddress?.fullName || user?.name || '',
    phone: user?.shippingAddress?.phone || user?.phone || '',
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    postalCode: user?.shippingAddress?.postalCode || '',
  });

  // Refresh the server cart so prices and stock are current before paying
  useEffect(() => {
    loadServerCart()
      .catch(() => {})
      .finally(() => setSyncing(false));
  }, [loadServerCart]);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const order = await placeOrder.mutateAsync({ shippingAddress: form, paymentMethod: 'COD', notes });
      clearLocal();
      useAuthStore.getState().setUser({ ...user, shippingAddress: form, phone: form.phone });
      toast.success('Order placed!');
      router.replace(`/orders/${order._id}?placed=1`);
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) loadServerCart().catch(() => {}); // stock changed — refresh cart
    }
  };

  if (syncing) {
    return (
      <div className="flex justify-center py-32 text-brand-blue">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (items.length === 0 && !placeOrder.isSuccess) {
    return <EmptyState title="Your cart is empty" message="Add something before checking out." actionHref="/shop" actionLabel="Shop Now" />;
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Shipping details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map((f) => (
                <div key={f.key} className={f.span === 2 ? 'sm:col-span-2' : ''}>
                  <label htmlFor={f.key} className="label">
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    className={`input ${errors[f.key] ? '!border-red-500' : ''}`}
                  />
                  {errors[f.key] && <p className="text-xs text-red-600 mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">
                  Order notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input h-auto py-3"
                  placeholder="Delivery instructions, landmark, etc."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Payment</h2>
            <label className="flex items-start gap-3 border border-brand-ink rounded-sm p-4 cursor-pointer">
              <input type="radio" checked readOnly className="mt-1 accent-brand-blue" />
              <span>
                <span className="block text-sm font-semibold">Cash on Delivery</span>
                <span className="block text-xs text-brand-mutedGray">Pay in cash when your order arrives.</span>
              </span>
            </label>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 self-start bg-brand-offwhite border border-brand-border rounded-md p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Order Summary</h2>
          <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative w-14 h-16 flex-shrink-0 bg-brand-surface rounded-sm overflow-hidden">
                  <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute -top-0 -right-0 bg-brand-ink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-brand-mutedGray">
                    {item.color} / {item.size}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <FreeShippingBar subtotal={subtotal} />
          <dl className="space-y-2 text-sm border-t border-brand-border pt-4">
            <div className="flex justify-between">
              <dt className="text-brand-slate">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-slate">Shipping</dt>
              <dd className="font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={placeOrder.isPending} className="btn-primary w-full">
            {placeOrder.isPending ? <Spinner /> : `Place Order · ${formatPrice(total)}`}
          </button>
          <Link href="/cart" className="block text-center text-xs font-semibold tracking-wide uppercase text-brand-slate hover:text-brand-blue">
            Edit Cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}
