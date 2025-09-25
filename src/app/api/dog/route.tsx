import { NextResponse } from 'next/server';
import { db } from '../../db/db';
import { Dog } from '../../db/schema';

export async function GET() {
  const allDogs = await db.select().from(Dog);
  return NextResponse.json(allDogs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newDog = await db.insert(Dog).values(data);
  return NextResponse.json(newDog);
}

