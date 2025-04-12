"use client";

export default function PayTestButton() {
  const handlePay = () => {
    fetch('/api/payment/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        email: 'test@example.com',
        reference: Date.now().toString(),
      }),
    }).then((res) => {
      console.log('error');
      console.log(res);
    }).catch((err) => {
      console.log('error');
      console.log(err);
  });
}

  return (
    <button onClick={handlePay} className="bg-gray-500 hover:bg-gray-700 px-2">Pay</button>
  );
}