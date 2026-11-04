'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useMyOrders, useUpdateProfile, useChangePassword } from '@/lib/accountQueries';
import { formatDate, formatPrice, cn } from '@/lib/format';
import { EmptyState, Skeleton, Spinner } from '@/components/ui/Feedback';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

function OrdersTab() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return <EmptyState title="No orders yet" message="When you place an order it will show up here." actionHref="/shop" actionLabel="Start Shopping" />;
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order._id}>
          <Link
            href={`/orders/${order._id}`}
            className="block border border-brand-border rounded-md p-4 hover:border-brand-ink transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-brand-mutedGray">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm font-semibold">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {order.items.slice(0, 4).map((item) => (
                <img key={item._id} src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-sm bg-brand-surface" />
              ))}
              {order.items.length > 4 && (
                <span className="text-xs text-brand-mutedGray">+{order.items.length - 4} more</span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    try {
      await changePassword.mutateAsync(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={saveProfile} className="border border-brand-border rounded-md p-6 space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase">Profile</h3>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" value={user?.email || ''} disabled className="input bg-brand-offwhite text-brand-mutedGray" />
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="input" />
        </div>
        <button type="submit" disabled={updateProfile.isPending} className="btn-dark">
          {updateProfile.isPending ? <Spinner /> : 'Save changes'}
        </button>
      </form>

      <form onSubmit={savePassword} className="border border-brand-border rounded-md p-6 space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase">Change password</h3>
        <div>
          <label className="label" htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            className="input"
          />
        </div>
        <button type="submit" disabled={changePassword.isPending} className="btn-dark">
          {changePassword.isPending ? <Spinner /> : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default function AccountView() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const tab = useSearchParams().get('tab') === 'profile' ? 'profile' : 'orders';

  const tabClass = (active) =>
    cn(
      'pb-3 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors',
      active ? 'border-brand-blue text-brand-ink' : 'border-transparent text-brand-mutedGray hover:text-brand-ink'
    );

  return (
    <div className="container-page py-10 max-w-4xl">
      <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">My Account</span>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Hey, {user?.name?.split(' ')[0]}</h1>

      <div className="flex gap-8 border-b border-brand-border mt-8 mb-8">
        <button className={tabClass(tab === 'orders')} onClick={() => router.replace(pathname)}>
          Orders
        </button>
        <button className={tabClass(tab === 'profile')} onClick={() => router.replace(`${pathname}?tab=profile`)}>
          Profile & Security
        </button>
      </div>

      {tab === 'orders' ? <OrdersTab /> : <ProfileTab />}
    </div>
  );
}
