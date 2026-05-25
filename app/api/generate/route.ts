import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { productName, brandType, targetAudience, keyBenefits, callToAction, platform, tone } = payload;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an expert UGC (User-Generated Content) ad scriptwriter. You create viral, high-converting ad scripts for social media platforms. Always respond with valid JSON only — no markdown, no code fences, no extra text.`;

    const userPrompt = `Generate 3 unique UGC ad script variations for the following:

Product Name: ${productName || 'Unknown Product'}
Brand/Industry: ${brandType || 'General'}
Target Audience: ${targetAudience || 'General audience'}
Key Benefits/Features: ${keyBenefits || 'General benefits'}
Platform: ${platform || 'TikTok'}
Tone: ${tone || 'Authentic'}
Desired Call to Action: ${callToAction || 'Check it out!'}

For each variation, provide:
1. "hook" — A short, attention-grabbing opening line (1-2 sentences max, designed to stop the scroll)
2. "script" — The full main script with scene directions and voiceover/dialogue (3-4 scenes, formatted with Scene numbers)
3. "caption" — A social media caption (2-3 sentences with emojis)
4. "hashtags" — 5-8 relevant hashtags as a single string (e.g. "#UGC #Ad #Skincare")
5. "cta" — A compelling call-to-action line

Return a JSON object with a single key "variations" containing an array of exactly 3 variation objects.
Example format:
{
  "variations": [
    { "hook": "...", "script": "...", "caption": "...", "hashtags": "...", "cta": "..." },
    { "hook": "...", "script": "...", "caption": "...", "hashtags": "...", "cta": "..." },
    { "hook": "...", "script": "...", "caption": "...", "hashtags": "...", "cta": "..." }
  ]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Groq API error:', response.status, errorBody);
      return NextResponse.json({ error: 'Groq API request failed' }, { status: 502 });
    }

    const completion = await response.json();
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content returned from Groq' }, { status: 502 });
    }

    // Parse the JSON array from the response
    // Strip markdown code fences if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleanContent);
    const scripts = parsed.variations || parsed;

    if (!Array.isArray(scripts) || scripts.length === 0) {
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 502 });
    }

    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

