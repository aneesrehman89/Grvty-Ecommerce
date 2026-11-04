import { Suspense } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import AccountView from '@/components/account/AccountView';

export const metadata = { title: 'My Account' };

export default function AccountPage() {
  return (
    <RequireAuth>
      <Suspense>
        <AccountView />
      </Suspense>
    </RequireAuth>
  );
}
