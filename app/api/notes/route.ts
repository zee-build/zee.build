import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'notes.json');

function ensureDataDir() {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    const { mkdirSync } = require('fs');
    mkdirSync(dir, { recursive: true });
  }
}

function readNotes(): any[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeNotes(notes: any[]) {
  ensureDataDir();
  writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ notes: readNotes() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notes = readNotes();

  if (body.action === 'create') {
    const note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: body.title || 'Untitled',
      content: body.content || '',
      updated_at: new Date().toISOString(),
    };
    notes.unshift(note);
    writeNotes(notes);
    return NextResponse.json({ note });
  }

  if (body.action === 'update') {
    const idx = notes.findIndex((n: any) => n.id === body.id);
    if (idx >= 0) {
      notes[idx] = { ...notes[idx], ...body.data, updated_at: new Date().toISOString() };
      writeNotes(notes);
      return NextResponse.json({ note: notes[idx] });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (body.action === 'delete') {
    const filtered = notes.filter((n: any) => n.id !== body.id);
    writeNotes(filtered);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
