import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function getDepartmentTransactionCount(id: number, type: string, startDate: string, endDate: string) {
  const validTypes = ['Submitted', 'Scheduled', 'Claimed', 'Rejected']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid Type')
  }

  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM transactions
      INNER JOIN users ON transactions.user_id = users.id
      WHERE users.department = ?
        AND transactions.status = ?
        AND transactions.transaction_date >= ?
        AND transactions.transaction_date <= ?`
    const params = [id, type.charAt(0).toUpperCase() + type.slice(1), startDate, endDate];

    const [logs] = await db.query(query, params) as RowDataPacket[];

    return logs[0].count
  } catch (error) {
    console.error("Error in getDepartmentTransactionCount:", error);
    throw error;
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type } = req.query
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
        case 'Submitted':
        case 'Scheduled':
        case 'Claimed':
        case 'Rejected':
          monthlyCount = await getDepartmentTransactionCount(Number(id), String(type), startOfMonth, endOfMonth)
          dailyCount = await getDepartmentTransactionCount(Number(id), String(type), startOfToday, endOfToday)
          yearlyCount = await getDepartmentTransactionCount(Number(id), String(type), startOfYear, endOfYear)
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
