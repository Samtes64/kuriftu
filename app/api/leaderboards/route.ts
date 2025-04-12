import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {MembershipService} from "@/lib/services/membership.service";

export async function GET(req: Request) {
    console.log("hiiiii")
    try {
        const membershipService = new MembershipService();
        const leaders = await membershipService.getLeaderboard()
        return  NextResponse.json({"leaders": leaders})
    } catch (error) {
        console.error("Error at /api/hotel POST", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}


