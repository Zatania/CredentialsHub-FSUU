import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

// Function to get the count of transactions
async function getTransactionCount(id: number, type: string, startDate: string, endDate: string) {
  const validTypes = ['Submitted Transaction', 'Scheduled Transaction', 'Claimed Transaction', 'Rejected Transaction']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid Type')
  }
  try {
    const query = `SELECT COUNT(*) AS count FROM staff_logs WHERE activity_type = ? AND staff_id = ? AND date >= ? AND date <= ?`
    const [logs] = await db.query(query, [type.charAt(0).toUpperCase() + type.slice(1), id, startDate, endDate]) as RowDataPacket[]

    return logs[0].count
  } catch (error) {
    throw error
  }
}

async function fetchStaffs() {
  // Your existing query to get staffs along with their departments
  const results = (await db.query(`
    SELECT s.id, s.username, s.employeeNumber, s.firstName, s.middleName, s.lastName, s.address, d.name AS department
    FROM staffs AS s
    LEFT JOIN staffs_departments AS sd ON s.id = sd.staff_id
    LEFT JOIN department AS d ON sd.department_id = d.id
    WHERE s.is_deleted = FALSE
  `)) as RowDataPacket

  // Transforming the result to group departments under each staff
  const staffsMap = new Map()
  results[0].forEach((row: any) => {
    if (!staffsMap.has(row.id)) {
      staffsMap.set(row.id, {
        ...row,
        departments: row.department ? [row.department] : []
      })
    } else {
      const staff = staffsMap.get(row.id)
      if (row.department) {
        staff.departments.push(row.department)
      }
    }
  })

  return Array.from(staffsMap.values())
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
      const staffs = await fetchStaffs()
      const types = ['Submitted Transaction', 'Scheduled Transaction', 'Claimed Transaction', 'Rejected Transaction']

      for (const staff of staffs) {
        staff.transactionCounts = {};
        for (const type of types) {
          const key = type.replace(/ /g, '_');
          staff.transactionCounts[key] = {
            dailyCount: await getTransactionCount(staff.id, type, startOfToday, endOfToday),
            monthlyCount: await getTransactionCount(staff.id, type, startOfMonth, endOfMonth),
            yearlyCount: await getTransactionCount(staff.id, type, startOfYear, endOfYear)
          };
        }
      }

      res.status(200).json(staffs)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
