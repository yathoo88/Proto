'use client';

import Link from 'next/link';
import { Button } from './button';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function LinkButton({ href, children, className }: LinkButtonProps) {
  return (
    <Link href={href} className="w-full">
      <Button className={className}>
        {children}
      </Button>
    </Link>
  );
}