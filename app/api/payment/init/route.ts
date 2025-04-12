// app/api/payment/init/route.ts
import { Chapa } from 'chapa-nodejs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Validate environment
    if (!process.env.CHAPA_SECRET_KEY) {
      throw new Error('Payment provider not configured');
    }

    // Validate input
    const { amount, email, reference } = await req.json();
    if (!amount || !email || !reference) {
      throw new Error('Missing required fields');
    }



    // Initialize payment
    const chapa = new Chapa({
      secretKey: process.env.CHAPA_SECRET_KEY,
    });

    console.log(amount, email, reference)

    const response = await chapa.initialize({
      amount: amount.toString(),
      currency: 'ETB',
      
     
      tx_ref: reference + Date.now().toLocaleString() + 'lkjhgf',
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/verify`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/booking/confirmation`,
      customization: {
        title: 'Booking Payment',
        description: `Payment for booking ${reference}`,
      },
    });

    console.log(response)

    return NextResponse.json({
      status: 'success',
      data: {
        checkout_url: response.data.checkout_url
      }
    });

  } catch (error: any) {
    console.log('error')
    console.dir(error)
    return NextResponse.json(
      { status: 'error', message: error },
      { status: 400 }
    );
  }
}