// app/payment/verify/page.tsx
"use client"
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref }),
        });
        // Redirect to success page
        window.location.href = '/booking/success';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        window.location.href = '/booking/failed';
      }
    };

    if (tx_ref) verifyPayment();
  }, [tx_ref]);

  return <div>Verifying payment...</div>;
}