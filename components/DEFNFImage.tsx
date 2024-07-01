import Image from 'next/image';
import React from 'react';

export default function DEFNFImage() {
  return (
    <picture>
      <source
        srcSet="/images/darkmode/defnf.png"
        media="(prefers-color-scheme: dark)"
      />
      <Image
        src="/images/lightmode/defnf.png"
        alt="DEFNF Logo"
        height={80}
        width={80}
      />
    </picture>
  );
}
