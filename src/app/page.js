// src/app/page.js
import PDFGenerator from '@/components/PDFGenerator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PDFGenerator />
    </main>
  );
}