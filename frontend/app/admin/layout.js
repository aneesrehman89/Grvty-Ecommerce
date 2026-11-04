import RequireAuth from '@/components/auth/RequireAuth';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = { title: 'Admin', robots: { index: false } };

export default function AdminLayout({ children }) {
  return (
    <RequireAuth admin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        <aside>
          <p className="text-[11px] font-bold text-brand-blue tracking-widest uppercase mb-3">Admin</p>
          <AdminNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </RequireAuth>
  );
}
