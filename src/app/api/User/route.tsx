import { NextResponse } from 'next/server';
import { db } from '../../db/db';
import { User } from '../../db/schema';

export async function GET() {
  const allUsers = await db.select().from(User);
  return NextResponse.json(allUsers);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newUser = await db.insert(User).values(data);
  return NextResponse.json(newUser);
}

