import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'

interface Prompt {
  id: number
  text: string
  contact_number: string
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const results = (await db.query('SELECT * FROM prompt')) as RowDataPacket

    const rows = results[0].map((row: Prompt) => ({
      id: row.id,
      text: row.text,
      contact_number: row.contact_number
    }))
    res.status(200).json(rows)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
