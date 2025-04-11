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

    const hotel = await prisma.hotel.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return new NextResponse("Missing hotel ID", { status: 400 });
    }

    const updatedHotel = await prisma.hotel.update({
      where: {
        id: body.id,
      },
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.error("Error at /api/hotel PUT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
