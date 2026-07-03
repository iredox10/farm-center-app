import { NextResponse } from 'next/server';

export async function GET() {
  const shops = [
    { id: 1, name: 'Tech Store One' },
    { id: 2, name: 'Gadget Galaxy' },
  ];
  return NextResponse.json({ success: true, shops });
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true, message: 'Shop created' });
}
