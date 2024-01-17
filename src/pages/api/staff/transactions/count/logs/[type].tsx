import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function getTransactionCount(id: number, type: string, startDate: string, endDate: string) {
  const validTypes = ['Submitted Transaction', 'Scheduled Transaction', 'Claimed Transaction', 'Rejected Transaction']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid Type')
  }

  try {
    const query = `SELECT COUNT(*) AS count FROM staff_logs WHERE staff_id = ? AND activity_type = ? AND date >= ? AND date <= ?`
    const [logs] = await db.query(query, [id, type, startDate, endDate]) as RowDataPacket[]

    return logs[0].count
  } catch (error) {
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, userId } = req.query
  let monthlyCount, dailyCount, yearlyCount

  if (req.method === 'GET') {
    try {
      const startOfToday = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const endOfToday = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
      const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss')
      const endOfYear = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')

      switch (type) {
        case 'Submitted Transaction':
        case 'Scheduled Transaction':
        case 'Claimed Transaction':
        case 'Rejected Transaction':
          monthlyCount = await getTransactionCount(Number(userId), String(type), startOfMonth, endOfMonth)
          dailyCount = await getTransactionCount(Number(userId), String(type), startOfToday, endOfToday)
          yearlyCount = await getTransactionCount(Number(userId), String(type), startOfYear, endOfYear)
          break
        default:
          return res.status(400).json({ message: 'Invalid Type' })
      }

      res.status(200).json({ dailyCount, monthlyCount, yearlyCount })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
