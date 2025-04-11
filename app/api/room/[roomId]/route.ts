import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { roomId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // First verify the room exists and belongs to the user
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: params.roomId,
        Hotel: {
          userId: session.user.id,
        },
      },
    });

    if (!existingRoom) {
      return new NextResponse("Room not found or unauthorized", { status: 404 });
    }

    const updatedRoom = await prisma.room.update({
      where: {
        id: params.roomId,
      },
      data: {
        ...body,
      },
      include: {
        Hotel: true,
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error at /api/room/[roomId] PUT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { roomId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the room belongs to the user
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: params.roomId,
        Hotel: {
          userId: session.user.id,
        },
      },
    });

    if (!existingRoom) {
      return new NextResponse("Room not found or unauthorized", { status: 404 });
    }

    // Check if there are any bookings for this room
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: params.roomId,
      },
    });

    if (bookings.length > 0) {
      return new NextResponse("Cannot delete room with existing bookings", { status: 400 });
    }

    const deletedRoom = await prisma.room.delete({
      where: {
        id: params.roomId,
      },
    });

    return NextResponse.json({ 
      message: "Room deleted successfully",
      room: deletedRoom 
    });
  } catch (error) {
    console.error("Error at /api/room/[roomId] DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { roomId: string } }) {
    try {
      const room = await prisma.room.findUnique({
        where: {
          id: params.roomId,
        },
        include: {
          Hotel: true,
        },
      });
  
      if (!room) {
        return new NextResponse("Room not found", { status: 404 });
      }
  
      return NextResponse.json(room);
    } catch (error) {
      console.error("Error at /api/room/[roomId] GET", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }