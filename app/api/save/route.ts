import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const row = {
      product_name: body.productName || body.product_name || 'Untitled',
      brand_type: body.brandType || body.brand_type || '',
      target_audience: body.targetAudience || body.target_audience || '',
      platform: body.platform || '',
      tone: body.tone || '',
      hook: body.hook || '',
      script: body.script || '',
      caption: body.caption || '',
      hashtags: body.hashtags || '',
      cta: body.cta || '',
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/saved_scripts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(row),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase save error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to save script' }, { status: 502 });
    }

    const saved = await response.json();
    return NextResponse.json({ message: 'Script saved successfully', data: saved });
  } catch (error) {
    console.error('Save API error:', error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
