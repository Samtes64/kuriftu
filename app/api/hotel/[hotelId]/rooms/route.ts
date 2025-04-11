import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { hotelId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    // Public endpoint, but if authenticated, verify ownership
    if (session?.user?.id) {
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: params.hotelId,
          userId: session.user.id,
        },
      });

      if (!hotel) {
        return new NextResponse("Hotel not found or unauthorized", { status: 404 });
      }
    }

    const rooms = await prisma.room.findMany({
      where: {
        hotelId: params.hotelId,
      },
      orderBy: {
        roomPrice: 'asc',
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelId]/rooms GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}