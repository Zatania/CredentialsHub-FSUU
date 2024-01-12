import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'

interface CredentialData {
  id: number
  name: string
  price: number
}
async function fetchCredentials() {
  const results = (await db.query('SELECT * FROM credentials')) as RowDataPacket

  const rows = results[0].map((row: CredentialData) => ({
    id: row.id,
    name: row.name,
    price: row.price
  }))

  return rows
}
async function addCredential(data: CredentialData) {
  try {
    const [rows] = await db.query(`INSERT INTO credentials (name, price) VALUES (?, ?)`, [data.name, data.price])

    return rows
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const credentials = await fetchCredentials()
      res.status(200).json(credentials)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else if (req.method === 'POST') {
    try {
      await addCredential(req.body);
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
