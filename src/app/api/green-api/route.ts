import { NextRequest, NextResponse } from 'next/server';

interface ProxyBody {
  url: string;
  method?: string;
  body?: unknown;
}

export async function POST(req: NextRequest) {
  const { url, method = 'GET', body }: ProxyBody = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}
