"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
//   const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reference) {
      // Verify payment and get booking details
      fetch(`/api/payment/verify?reference=${reference}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            console.log(data.booking);
          } else {
            setError(data.message || 'Payment verification failed');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to verify payment');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [reference]);

  if (loading) {
    return <div>Verifying your payment...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your booking. Your payment was successful.
        </p>
      </div>

      {/* {booking && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span>{booking.paymentIntentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dates:</span>
              <span>
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid:</span>
              <span>ETB {booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )} */}

      <div className="mt-8 flex justify-center">
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    </div>
  );
}