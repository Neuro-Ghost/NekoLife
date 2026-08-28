'use client';

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="mb-4">Could not find the requested resource.</p>
      <Link href="/" className="underline text-blue-500">
        Return Home
      </Link>
    </div>
  );
}
