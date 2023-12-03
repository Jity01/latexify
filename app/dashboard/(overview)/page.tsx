import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton
} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

export default async function Page() {
  return (
    <main>
      <div style={{maxWidth: "700px", margin: "20px auto"}} className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        <hr />
        <hr />
        <br />
        <h1><strong>Welcome to Latexify!</strong></h1>
        <br/>
          <p>
          With Latexify, you can draw up a diagram by hand and swiftly convert it into TikZ code to embed in your 
          LaTeX documents—be it a research paper or a LaTeX-based note.Initially focusing on converting physics 
          diagrams to TikZ, we plan to expand our tool based on user feedback and performance evaluations.
          </p>
        </div>
      <hr />
      <hr />
      <br />
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <br />
      <br />
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
    </main>
  );
}