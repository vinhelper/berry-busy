'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
