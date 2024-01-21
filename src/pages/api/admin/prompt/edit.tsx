import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'

// Mock functions, replace with actual database logic
async function updatePrompt(data: any) {
  try {
    await db.query(`UPDATE prompt SET text = ?, contact_number = ? WHERE id = ?`, [data.text, data.contact_number, data.id])

    return 'success'
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const data = req.body
      await updatePrompt(data)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
