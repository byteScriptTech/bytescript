// API route to create a roomId using nanoid.
// - Stateless version: returns a generated ID (unguessable).
// - Add auth checks / persist to DB if you want ownership/TTL.

import { customAlphabet } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  14
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const roomId = nanoid();

  return res.status(201).json({ roomId });
}
