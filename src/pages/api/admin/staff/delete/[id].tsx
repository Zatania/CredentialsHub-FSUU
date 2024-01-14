import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../db'

async function deleteStaff(id: number) {
  try {
    await db.query(`DELETE FROM staffs_departments WHERE staff_id = ?`, [id])
    await db.query(`DELETE FROM staffs_roles WHERE staff_id = ?`, [id])
    await db.query(`DELETE FROM staffs WHERE id = ?`, [id])
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
      await deleteStaff(Number(id));
      res.status(204).end();
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || 'Internal Server Error';
      res.status(500).json({ message: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
