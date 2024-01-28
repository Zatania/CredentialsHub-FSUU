import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

// Function to get the count of transactions
async function getTransactionCount(id: number, type: string, startDate: string, endDate: string) {
  const validTypes = ['Scheduled Transaction', 'Claimed Transaction']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid Type')
  }
  try {
    const query = `SELECT COUNT(*) AS count FROM student_assistants_logs WHERE activity_type = ? AND sa_id = ? AND date >= ? AND date <= ?`
    const [logs] = await db.query(query, [type.charAt(0).toUpperCase() + type.slice(1), id, startDate, endDate]) as RowDataPacket[]

    return logs[0].count
  } catch (error) {
    throw error
  }
}

async function fetchSA() {
  // Your existing query to get sa along with their departments
  const results = (await db.query(`
    SELECT s.id, s.username, s.sa_number, s.firstName, s.middleName, s.lastName, s.address, s.role, d.name AS department
    FROM student_assistants AS s
    LEFT JOIN student_assistants_departments AS sd ON s.id = sd.sa_id
    LEFT JOIN department AS d ON sd.department_id = d.id
    WHERE s.is_deleted = FALSE
  `)) as RowDataPacket

  // Transforming the result to group departments under each sa
  const saMaps = new Map()
  results[0].forEach((row: any) => {
    if (!saMaps.has(row.id)) {
      saMaps.set(row.id, {
        ...row,
        departments: row.department ? [row.department] : []
      })
    } else {
      const sa = saMaps.get(row.id)
      if (row.department) {
        sa.departments.push(row.department)
      }
    }
  })

  return Array.from(saMaps.values())
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Dates for daily, monthly, and yearly counts
      const startOfToday = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const endOfToday = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
      const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss')
      const endOfYear = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')
      const sas = await fetchSA()
      const types = ['Scheduled Transaction', 'Claimed Transaction']

      for (const sa of sas) {
        sa.transactionCounts = {};
        for (const type of types) {
          const key = type.replace(/ /g, '_');
          sa.transactionCounts[key] = {
            dailyCount: await getTransactionCount(sa.id, type, startOfToday, endOfToday),
            monthlyCount: await getTransactionCount(sa.id, type, startOfMonth, endOfMonth),
            yearlyCount: await getTransactionCount(sa.id, type, startOfYear, endOfYear)
          };
        }
      }

      res.status(200).json(sas)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
