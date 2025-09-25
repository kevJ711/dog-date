import { NextResponse } from 'next/server';
import { db } from '../../db/db';
import { Message } from '../../db/schema';

export async function GET() {
  const messages = await db.select().from(Message);
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newMessage = await db.insert(Message).values(data);
  return NextResponse.json(newMessage);
}
