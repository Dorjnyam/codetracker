'use client';

import Image from "next/image";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CodeTracker
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            A comprehensive platform for coding education, collaboration, and progress tracking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Learn to Code</h3>
            <p className="text-sm text-gray-600">Interactive coding challenges and assignments</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Collaborate</h3>
            <p className="text-sm text-gray-600">Work together with peers and mentors</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your coding journey and achievements</p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/auth/signin">
            <Button className="rounded-full h-10 sm:h-12 px-4 sm:px-5">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="rounded-full h-10 sm:h-12 px-4 sm:px-5">
              Sign Up
            </Button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
