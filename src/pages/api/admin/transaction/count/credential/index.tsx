import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

interface CredentialCountsData {
  id: number
  name: string
  total_quantity: string
}

async function getCredentialsCount(startDate: string, endDate: string) {
  try {
    const query = `
      SELECT c.id, c.name,
        COALESCE(SUM(td.total_quantity), 0) + COALESCE(SUM(pc.total_quantity), 0) AS total_quantity
      FROM credentials c
      LEFT JOIN (
        SELECT td.credential_id, SUM(td.quantity) as total_quantity
        FROM transaction_details td
        INNER JOIN transactions t ON td.transaction_id = t.id
        WHERE t.transaction_date >= ? AND t.transaction_date <= ?
        GROUP BY td.credential_id
      ) as td ON c.id = td.credential_id
      LEFT JOIN (
        SELECT pc.credential_id, SUM(pc.quantity) as total_quantity
        FROM package_contents pc
        INNER JOIN package_transactions pt ON pc.package_id = pt.package_id
        INNER JOIN transactions t ON pt.transaction_id = t.id
        WHERE t.transaction_date >= ? AND t.transaction_date <= ?
        GROUP BY pc.credential_id
      ) as pc ON c.id = pc.credential_id
      GROUP BY c.id, c.name
      ORDER BY c.name ASC;
    `
    const params = [startDate, endDate, startDate, endDate]



    const results = await db.query(query, params) as RowDataPacket

    const rows = results[0].map((row: CredentialCountsData) => ({
      id: row.id,
      name: row.name,
      total_quantity: row.total_quantity
    }))

    return rows
  } catch (error) {
    console.error("Error in getDepartmentTransactionCount:", error)
    throw error
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let monthlyCount, dailyCount, yearlyCount

  if (req.method === 'GET') {
    try {
      const startOfToday = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const endOfToday = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
      const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss')
      const endOfYear = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')

      dailyCount = await getCredentialsCount(startOfToday, endOfToday)
      monthlyCount = await getCredentialsCount(startOfMonth, endOfMonth)
      yearlyCount = await getCredentialsCount(startOfYear, endOfYear)

      res.status(200).json({ dailyCount, monthlyCount, yearlyCount })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
