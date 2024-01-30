import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'

interface StaffLogsData {
  id: number
  timestamp: string
  staff: string
  staff_id: number
  student: string
  department: string
  course: string
  schoolYear: string
  payment_date: string
  schedule_date: string | null
  date_released: string | null
  status: string | null
  task_done: string | null
  remarks: string | null
  credentials_requested: string
}
async function fetchStaffLogs() {
  const results = (await db.query(`
    SELECT
      t.id AS id,
      t.transaction_date AS timestamp,
      s.id AS staff_id,
      CONCAT(s.firstName, ' ', s.lastName) AS staff,
      CONCAT(u.firstName, ' ', u.lastName) AS student,
      d.name AS department,
      u.course,
      CASE
          WHEN u.graduateCheck = 'yes' THEN u.graduationDate
          ELSE CONCAT(u.schoolYear, ' - ', u.semester)
      END AS schoolYear,
      t.payment_date AS payment_date,
      CASE
          WHEN t.schedule IS NOT NULL THEN t.schedule
      END AS schedule_date,
      CASE
          WHEN t.claim IS NOT NULL THEN t.claim
          WHEN t.reject IS NOT NULL THEN t.reject
          ELSE NULL
      END AS date_released,
      CASE
          WHEN t.claim IS NOT NULL THEN 'Claimed'
          WHEN t.reject IS NOT NULL THEN 'Rejected'
          ELSE NULL
      END AS status,
      CASE
          WHEN t.task_done IS NOT NULL THEN t.task_done
      END AS task_done,
      COALESCE(
        GROUP_CONCAT(DISTINCT CASE WHEN td.quantity > 0 THEN CONCAT(c.name, ' (', td.quantity, ')') END ORDER BY c.name),
        GROUP_CONCAT(DISTINCT CONCAT(cp.name, ' (', pc.quantity, ')') ORDER BY cp.name)
      ) AS credentials_requested,
      CASE
          WHEN t.claim IS NOT NULL THEN t.claimed_remarks
          WHEN t.reject IS NOT NULL THEN t.rejected_remarks
          ELSE NULL
      END AS remarks
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN department d ON u.department = d.id
    JOIN transaction_history th ON t.id = th.transaction_id
    JOIN staffs s ON th.staff_id = s.id
    LEFT JOIN transaction_details td ON t.id = td.transaction_id
    LEFT JOIN credentials c ON td.credential_id = c.id AND td.quantity > 0
    LEFT JOIN package_transactions pt ON t.id = pt.transaction_id
    LEFT JOIN package_contents pc ON pt.package_id = pc.package_id
    LEFT JOIN credentials cp ON pc.credential_id = cp.id
    GROUP BY
      t.id,
      t.transaction_date,
      s.id,
      s.firstName, s.lastName,
      u.firstName, u.lastName,
      d.name,
      u.course,
      u.graduateCheck, u.graduationDate, u.schoolYear, u.semester,
      t.payment_date,
      t.claim, t.reject,
      t.claimed_remarks, t.rejected_remarks
  `)) as RowDataPacket

  const rows = results[0].map((row: StaffLogsData) => ({
    id: row.id,
    timestamp: row.timestamp,
    staff_id: row.staff_id,
    staff: row.staff,
    student: row.student,
    department: row.department,
    course: row.course,
    schoolYear: row.schoolYear,
    payment_date: row.payment_date,
    schedule_date: row.schedule_date,
    date_released: row.date_released,
    status: row.status,
    task_done: row.task_done,
    credentials_requested: row.credentials_requested,
    remarks: row.remarks
  }))

  return rows
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const credentials = await fetchStaffLogs()
      res.status(200).json(credentials)
    } catch (error) {
      console.log(error)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
