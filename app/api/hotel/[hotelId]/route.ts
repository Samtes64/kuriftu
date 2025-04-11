import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { hotelId: string } }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const updatedHotel = await prisma.hotel.update({
      where: { id: params.hotelId },
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { hotelId: string } }) {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
  
      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const deletedHotel = await prisma.hotel.delete({
        where: {
          id: params.hotelId,
        },
      });
  
      return NextResponse.json({ message: "Hotel deleted successfully", hotel: deletedHotel });
    } catch (error) {
      console.error("Error deleting hotel:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }