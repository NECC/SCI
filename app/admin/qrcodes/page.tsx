"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Spinner } from '@nextui-org/react';

export default function QRCodesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/activities');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}

