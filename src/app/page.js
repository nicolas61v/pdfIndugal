// src/app/page.js
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PDFGenerator = dynamic(() => import('@/components/PDFGenerator'), {
  ssr: false
});

const InvoiceSelector = dynamic(() => import('@/components/InvoiceSelector'), {
  ssr: false
});

export default function Home() {
  const [selectedInvoiceType, setSelectedInvoiceType] = useState(null);

  const handleSelectCold = () => {
    setSelectedInvoiceType('cold');
  };

  const handleBackToSelector = () => {
    setSelectedInvoiceType(null);
  };

  if (selectedInvoiceType === 'cold') {
    return (
      <main>
        <PDFGenerator onBackToSelector={handleBackToSelector} />
      </main>
    );
  }

  return (
    <main>
      <InvoiceSelector onSelectCold={handleSelectCold} />
    </main>
  );
}