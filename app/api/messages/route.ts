import { NextResponse } from 'next/server';

// Простое in-memory хранилище для демо
// В продакшене использовать Supabase, Firebase или Netlify Blobs
const messageStore = new Map<string, any>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');

  if (!session) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const messages = messageStore.get(session) || { messages: [] };
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const { session, messages } = await request.json();

    if (!session) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    messageStore.set(session, { messages });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Messages save error:', error);
    return NextResponse.json(
      { error: 'Ошибка при сохранении' },
      { status: 500 }
    );
  }
}
