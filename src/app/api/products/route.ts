import { NextResponse } from 'next/server';

export async function GET() {
  const products = [
    { id: 1, name: 'Smartphone XYZ', price: 500 },
    { id: 2, name: 'Laptop Pro', price: 1200 },
  ];
  return NextResponse.json({ success: true, products });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
