import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/saved_scripts?order=created_at.desc&select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase fetch error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to fetch scripts' }, { status: 502 });
    }

    const scripts = await response.json();
    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Saved API GET error:', error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing script id' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/saved_scripts?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase delete error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to delete script' }, { status: 502 });
    }

    return NextResponse.json({ message: 'Script deleted successfully' });
  } catch (error) {
    console.error('Saved API DELETE error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
