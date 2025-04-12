// app/payment/verify/PaymentVerificationClient.tsx
'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentVerificationClient() {
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
        window.location.href = '/booking/success';
      } catch (error) {
        console.log(error)
        window.location.href = '/booking/failed';
      }
    };

    if (tx_ref) verifyPayment();
  }, [tx_ref]);

  return <div>Verifying payment...</div>;
}
