import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../db'
import dayjs from 'dayjs'

async function verifyOrUnverify(id: number, status: string, remarks: string, session: any) {
  try {
    if(session?.user.role === 'admin') {
      const admin = session?.user
      await db.query(`
        UPDATE users
        SET status = ?, remarks = ?
        WHERE id = ?
      `, [status, remarks, id])

      const message = `${admin.firstName} ${admin.lastName} has ${status} a student.`
      const activity = `${status} Student`

      await db.query(`INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [admin.id, message, activity, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else {
      const staff = session?.user

      await db.query(`
        UPDATE users
        SET status = ?, remarks = ?
        WHERE id = ?
      `, [status, remarks, id])

      const message = `${staff.firstName} ${staff.lastName} has ${status} a student.`
      const activity = `${status} Student`

      await db.query(`INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [staff.id, message, activity, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    }
  } catch(error) {
    console.error("Error in verifyOrUnverify:", error);
    throw error;
  }
}

async function sendRemarks (id: number, remarks: string) {
  try {
    await db.query(`
      UPDATE users
      SET remarks = ?
      WHERE id = ?
    `, [remarks, id])
  } catch(error) {
    console.error("Error in sendRemarks:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, status } = req.query
  const { remarks, session } = req.body

  if (req.method === 'PUT') {
    try {
      if (status) {
        await verifyOrUnverify(Number(id), String(status), String(remarks), session)
        res.status(200).end()
      } else {
        await sendRemarks(Number(id), String(remarks))
        res.status(200).end()
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
