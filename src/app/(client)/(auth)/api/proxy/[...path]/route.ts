import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(
  req: NextRequest,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const url = `${BACKEND_URL}/${params.path.join('/')}`;

  const headers = new Headers();


  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);


  const tokenCookie = req.cookies.get('token')?.value;
  if (tokenCookie) {
    headers.set('authorization', `Bearer ${tokenCookie}`);
  }

  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.method === 'GET' ? undefined : await req.arrayBuffer(),
    credentials: 'include',
  });

  const data = await res.arrayBuffer();
  const response = new NextResponse(data, { status: res.status });


  const setCookie = res.headers.get('set-cookie');
  if (setCookie) response.headers.set('set-cookie', setCookie);

  const resContentType = res.headers.get('content-type');
  if (resContentType) response.headers.set('content-type', resContentType);

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
