import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleAuth(req: Request, res: Response) {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: 'idToken is required' });
    return;
  }

  // Verify the Google ID token
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    res.status(401).json({ error: 'Invalid Google token' });
    return;
  }

  if (!payload?.email) {
    res.status(401).json({ error: 'Could not retrieve email from token' });
    return;
  }

  // Find or create the user in the database
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', payload.email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    res.status(500).json({ error: 'Database error' });
    return;
  }

  let user = existingUser;

  if (!user) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ email: payload.email, name: payload.name })
      .select()
      .single();

    if (insertError) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    user = newUser;
  }

  // Issue a JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
