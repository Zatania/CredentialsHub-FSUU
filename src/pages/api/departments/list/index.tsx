import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

interface Department {
  id: number
  name: string
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const results = (await db.query('SELECT * FROM department')) as RowDataPacket

    const rows = results[0].map((row: Department) => ({
      id: row.id,
      name: row.name
    }))
    res.status(200).json(rows)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
