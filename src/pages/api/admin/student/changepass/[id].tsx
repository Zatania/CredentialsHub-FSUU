import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

async function updateStudent(id: number, password: string) {
  try {
    // Update staff basic information
    const updateQuery = `UPDATE users SET password = ? WHERE id = ?`
    await db.query(updateQuery, [password, id])

    return
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const { password } = req.body;

  if (req.method === 'PUT') {
    try {
      await updateStudent(Number(id), password)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
