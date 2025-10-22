import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href="/" className="group">
      <span className="text-foreground text-base font-bold transition-colors group-hover:opacity-80">
        byte
      </span>
      <span className="text-[#00BFA6] text-xl font-bold transition-colors group-hover:opacity-80">
        Script.
      </span>
    </Link>
  );
};

export default Logo;
