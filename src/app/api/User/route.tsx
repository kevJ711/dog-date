import { NextResponse } from 'next/server';
import { db } from '../../db/db';
import { User } from '../../db/schema';

export async function GET() {
  const allUsers = await db.select().from(User);
  return NextResponse.json(allUsers);
}

export async function POST(req: Request) {
  return NextResponse.json({ error: 'Use /api/auth/signup to create users' }, { status: 405 });
}
