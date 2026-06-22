import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';

const ASSETS = path.join(process.cwd(), 'src', 'assets', 'images');

function toDataUri(filename: string): string {
  const ext  = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const buf  = fs.readFileSync(path.join(ASSETS, filename));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;

    const logo      = toDataUri('logo-tehrisma.jpeg');
    const halalLogo = toDataUri('logo-halal-indonesia.png');

    const data: InvoiceData = { ...body, logo, halalLogo };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(InvoicePDF, { data }) as any
    );

    const safeName = body.customerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const filename = `Invoice-${body.invoiceNo}-${safeName}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF] invoice error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF' }, { status: 500 });
  }
}
