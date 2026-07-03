import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const mockResults = [
    { id: 1, type: 'product', name: `${query} mock product 1` },
    { id: 2, type: 'shop', name: `${query} mock shop 1` },
  ];

  return NextResponse.json({ success: true, results: mockResults });
}
