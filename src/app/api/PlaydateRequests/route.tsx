import { NextResponse } from "next/server";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";
import { PlaydateRequests } from "@/app/db/schema";

export async function GET() {
    const allPlaydateRequests = await db.select().from(PlaydateRequests);
    return NextResponse.json(allPlaydateRequests);
    }
;
export async function POST(req: Request) {
    const data = await req.json();
    const newPlaydateRequest = await db.insert(PlaydateRequests).values(data);
    return NextResponse.json(newPlaydateRequest);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await db.delete(PlaydateRequests).where(eq(PlaydateRequests.id, id));
    return NextResponse.json({ message: "Playdate request deleted" });
}