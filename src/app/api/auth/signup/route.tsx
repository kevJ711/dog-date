import { NextResponse } from 'next/server';
import { db } from '../../../db/db';
import { User } from '../../../db/schema';
import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, password } = body ?? {};

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(User)
      .where(or(eq(User.email, email), eq(User.username, username)));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email or username already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(User).values({ name, email, username, password: hashed });

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


