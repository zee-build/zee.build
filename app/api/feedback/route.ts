import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'feedback.json');

function ensureDataDir() {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    const { mkdirSync } = require('fs');
    mkdirSync(dir, { recursive: true });
  }
}

function readFeedback(): any[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeFeedback(items: any[]) {
  ensureDataDir();
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = readFeedback();
  return NextResponse.json({ feedback: items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === 'submit') {
    const items = readFeedback();
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: body.name || 'Anonymous',
      message: body.message,
      timestamp: new Date().toISOString(),
      visible: true,
    };
    items.unshift(item);
    writeFeedback(items);
    return NextResponse.json({ feedback: item });
  }

  if (body.action === 'toggle') {
    const items = readFeedback();
    const idx = items.findIndex((f: any) => f.id === body.id);
    if (idx >= 0) {
      items[idx].visible = !items[idx].visible;
      writeFeedback(items);
      return NextResponse.json({ feedback: items[idx] });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (body.action === 'delete') {
    const items = readFeedback().filter((f: any) => f.id !== body.id);
    writeFeedback(items);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
