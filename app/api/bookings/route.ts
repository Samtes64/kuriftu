import { auth } from "@/lib/auth";
import prisma from '@/lib/prisma'
import { NextResponse } from "next/server";
import { z } from 'zod'

const bookingSchema = z.object({
  roomId: z.string(),
  hotelId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  totalPrice: z.number(),
  includesBreakfast: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const userId = session?.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json()
    const validation = bookingSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      )
    }

    const { roomId, hotelId, checkIn, checkOut, totalPrice, includesBreakfast } = validation.data

    // Check room availability
    const conflictingBookings = await prisma.booking.count({
      where: {
        roomId,
        OR: [
          {
            startDate: { lt: new Date(checkIn) },
            endDate: { gt: new Date(checkOut) },
          },
        ],
        
      },
    })

    if (conflictingBookings > 0) {
      return NextResponse.json(
        { error: 'Room not available for selected dates' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        hotelId,
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
        totalPrice,
        breakfastIncluded: includesBreakfast ?? false,
        currency: 'ETB', // or any supported currency
        paymentIntentId: crypto.randomUUID(), // or your Stripe intent ID if integrated
      },
      include: {
        Hotel: true,
        Room: true,
      },
    })
    
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('[BOOKINGS_POST]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        Room: {
          select: {
            title: true,
            image: true,
          },
        },
        Hotel: true
      },
      orderBy: {
        bookedAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[BOOKINGS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}