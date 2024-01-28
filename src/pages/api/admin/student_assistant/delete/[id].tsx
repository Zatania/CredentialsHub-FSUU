import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

async function deleteSA(id: number) {
  try {
    await db.query(`UPDATE student_assistants SET is_deleted = TRUE WHERE id = ?`, [id])
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await deleteSA(Number(id));
      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        const errorMessage = error.message || 'Internal Server Error';
        res.status(500).json({ message: errorMessage });
      }
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
