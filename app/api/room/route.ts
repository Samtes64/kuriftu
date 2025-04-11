import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Verify the user owns the hotel they're adding a room to
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: body.hotelId,
        userId: session.user.id,
      },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found or unauthorized", { status: 404 });
    }

    const room = await prisma.room.create({
      data: {
        ...body,
        hotelId: body.hotelId,
      },
      include: {
        Hotel: true,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error at /api/room POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}