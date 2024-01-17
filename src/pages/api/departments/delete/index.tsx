import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

async function deleteDepartment(id: number) {
  try {
    await db.query(`UPDATE department SET is_deleted = TRUE WHERE id = ?`, [id])

    return 'success'
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      await deleteDepartment(Number(id))
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
