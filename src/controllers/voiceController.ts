import { Response } from 'express';
import OpenAI from 'openai';
import { AuthRequest } from '../middleware/authenticate';

export async function parseTranscript(req: AuthRequest, res: Response) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    res.status(400).json({ error: 'transcript is required' });
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  const prompt = `
Today's date is ${today}.

Extract appointment details from the following transcript and return a JSON object.

Rules:
- Resolve relative dates (e.g. "next Friday", "tomorrow") to an actual date in YYYY-MM-DD format
- Return time in HH:MM 24-hour format, or null if not mentioned
- Return null for any field that is not mentioned
- Only return the JSON object, nothing else

Transcript: "${transcript}"

Return this exact structure:
{
  "title": "string",
  "date": "YYYY-MM-DD or null",
  "time": "HH:MM or null",
  "location": "string or null",
  "notes": "string or null"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0].message.content;
    const event = JSON.parse(raw!);

    res.json({ event });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to parse transcript' });
  }
}
