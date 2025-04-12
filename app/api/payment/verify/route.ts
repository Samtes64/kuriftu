// app/api/payment/verify/route.ts
import { Chapa } from 'chapa-nodejs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { tx_ref } = await req.json();
  const chapa = new Chapa({
    secretKey: process.env.CHAPA_SECRET_KEY!,
  });

  try {
    const verification = await chapa.verify({ tx_ref });
    return NextResponse.json(verification);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  }
}