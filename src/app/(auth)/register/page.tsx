import Link from 'next/link';
import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create your account · BerryBusy',
};

export default function RegisterPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Start your first board in under a minute.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
