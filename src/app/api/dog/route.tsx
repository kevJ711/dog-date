import { NextResponse } from 'next/server';
import { db } from '../../../lib/db/db';
import { Dog } from '../../../lib/db/schema';
import { eq } from "drizzle-orm";

export async function GET() {
  const allDogs = await db.select().from(Dog);
  return NextResponse.json(allDogs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newDog = await db.insert(Dog).values(data);
  return NextResponse.json(newDog);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await db.delete(Dog).where(eq(Dog.id, id));
    return NextResponse.json({ message: "Dog deleted" });
}

