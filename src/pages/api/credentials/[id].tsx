import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../db'

// Mock functions, replace with actual database logic
async function updateCredential(id: number, data: any) {
  try {
    const [rows] = await db.query(`UPDATE credentials SET name = ?, price = ? WHERE id = ?`, [data.name, data.price, id])

    return rows
  } catch(error) {
    throw error
  }
}

async function deleteCredential(id: number) {
  try {
    const [rows] = await db.query(`UPDATE credentials SET is_deleted = TRUE WHERE id = ?`, [id])

    return rows
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const data = req.body
      await updateCredential(Number(id), data)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteCredential(Number(id))
      res.status(204).end()
    } catch (error) {
      console.error(error)
      const errorMessage = error.message || 'Internal Server Error'
      res.status(500).json({ message: errorMessage })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
