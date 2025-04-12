// app/api/bookings/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { roomId, checkIn, checkOut, breakfastIncluded } = await req.json();

    // Validate input
    if (!roomId || !checkIn || !checkOut) {
      throw new Error('Missing required booking information');
    }

    // Verify room exists and get prices
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { roomPrice: true, breakfastPrice: true }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    // Create booking record
    // const booking = await prisma.booking.create({
    //   data: {
    //     roomId,
    //     startDate: new Date(checkIn),
    //     endDate: new Date(checkOut),
    //     breakfastIncluded,
    //     status: 'PENDING_PAYMENT',
    //     // Include other necessary fields
    //   }
    // });
    console.log(roomId,checkIn,checkOut, breakfastIncluded)

    return NextResponse.json({
      status: 'success',
    //   data: booking
    });

  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 400 }
    );
  }
}