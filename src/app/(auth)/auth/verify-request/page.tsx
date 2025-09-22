'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Check Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your sign-in.
            </p>
            <p className="text-sm text-muted-foreground">
              The link will expire in 24 hours.
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Try again
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
