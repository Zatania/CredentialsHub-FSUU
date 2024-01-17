import type { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function getUserLogs() {
  const [logs] = (await db.query(`SELECT * FROM user_logs ORDER BY date DESC`)) as RowDataPacket[]

  const rows = logs.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    activity: row.activity,
    activity_type: row.activity_type,
    date: dayjs(row.created_at).format('MMMM DD, YYYY hh:mm A')
  }))

  return rows
}

async function getAdminLogs() {
  const [logs] = (await db.query(`SELECT * FROM admins_logs ORDER BY date DESC`)) as RowDataPacket[]

  const rows = logs.map((row: any) => ({
    id: row.id,
    userId: row.admin_id,
    activity: row.activity,
    activity_type: row.activity_type,
    date: dayjs(row.created_at).format('MMMM DD, YYYY hh:mm A')
  }))

  return rows
}

async function getStaffLogs() {
  const [logs] = (await db.query(`SELECT * FROM staff_logs ORDER BY date DESC`)) as RowDataPacket[]

  const rows = logs.map((row: any) => ({
    id: row.id,
    userId: row.staff_id,
    activity: row.activity,
    activity_type: row.activity_type,
    date: dayjs(row.created_at).format('MMMM DD, YYYY hh:mm A')
  }))

  return rows
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { role, page, limit } = req.query
  let logs = []

  if (req.method === 'GET') {
    try {
      switch (role) {
        case 'student':
          logs = await getUserLogs()
          break
        case 'admin':
          logs = await getAdminLogs()
          break
        case 'staff':
          logs = await getStaffLogs()
          break
        default:
          return res.status(400).json({ message: 'Invalid role' })
      }

      // Implement pagination logic
      const startIndex = (Number(page) - 1) * Number(limit)
      const endIndex = startIndex + Number(limit)
      const paginatedLogs = logs.slice(startIndex, endIndex)

      res.status(200).json(paginatedLogs)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
