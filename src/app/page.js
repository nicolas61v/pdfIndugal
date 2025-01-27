// src/app/page.js
'use client';

import dynamic from 'next/dynamic';

const PDFGenerator = dynamic(() => import('@/components/PDFGenerator'), {
  ssr: false
});

export default function Home() {
  return (
    <main>
      <PDFGenerator />
    </main>
  );
}