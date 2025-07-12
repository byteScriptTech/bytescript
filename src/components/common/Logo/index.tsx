import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <span className="text-black text-base font-bold">bite</span>
      <span className="text-[#00BFA6] text-xl font-bold">Script.</span>
    </Link>
  );
};

export default Logo;
