import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

async function getTransactionCount(id: number, type: string) {
  const validTypes = ['submitted', 'scheduled', 'claimed', 'rejected']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid Type')
  }

  try {
    const query = `SELECT COUNT(*) AS count FROM transactions WHERE user_id = ? AND status = ?`
    const [logs] = await db.query(query, [id, type.charAt(0).toUpperCase() + type.slice(1)]) as RowDataPacket[]

    return logs[0].count
  } catch (error) {
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, userId } = req.query
  let logs = []

  if (req.method === 'GET') {
    try {
      switch (type) {
        case 'submitted':
          logs = await getTransactionCount (Number(userId), String(type))
          break
        case 'scheduled':
          logs = await getTransactionCount(Number(userId), String(type))
          break
        case 'claimed':
          logs = await getTransactionCount(Number(userId), String(type))
          break
        case 'rejected':
          logs = await getTransactionCount(Number(userId), String(type))
          break
        default:
          return res.status(400).json({ message: 'Invalid Type' })
      }

      res.status(200).json(logs)
    } catch (error) {
      console.log(error)
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
