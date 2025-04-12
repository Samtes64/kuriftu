"use client"
// app/payment/verify/page.tsx
import dynamic from 'next/dynamic';

const PaymentVerificationClient = dynamic(() => import('./client'), {
  ssr: false, // Prevents issues with server rendering
});

export default function PaymentVerificationPage() {
  return <PaymentVerificationClient />;
}
