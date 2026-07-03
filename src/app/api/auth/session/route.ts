import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { session } = await request.json();

    if (!session) {
      return NextResponse.json({ error: 'Session is required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_session', session, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_session');
  return response;
}
