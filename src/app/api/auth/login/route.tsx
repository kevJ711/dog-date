import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db/db';
import { User } from '../../../../lib/db/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq, or } from 'drizzle-orm';

const JWT_NAME = 'auth_token';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body ?? {};

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const users = await db
      .select()
      .from(User)
      .where(or(eq(User.email, identifier), eq(User.username, identifier)));

    const user = users[0];
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, (user as any).password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const token = jwt.sign({ sub: user.id, username: user.username }, secret, {
      expiresIn: '7d',
    });

    const res = NextResponse.json({ message: 'Logged in' });
    res.cookies.set(JWT_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


