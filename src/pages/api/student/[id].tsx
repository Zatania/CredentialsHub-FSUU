import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../db'
import { getSession } from 'next-auth/react'
import dayjs from 'dayjs'

async function verifyOrUnverify(id: number, status: string, session: any) {
  try {
    if(session?.user.role === 'admin') {
      const admin = session?.user
      await db.query(`
        UPDATE users
        SET status = ?
        WHERE id = ?
      `, [status, id])

      const message = `${admin.firstName} ${admin.lastName} has ${status} a student.`
      const activity = `${status} Student`

      await db.query(`INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [admin.id, message, activity, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else {
      const staff = session?.user

      await db.query(`
        UPDATE users
        SET status = ?
        WHERE id = ?
      `, [status, id])

      const message = `${staff.firstName} ${staff.lastName} has ${status} a student.`
      const activity = `${status} Student`

      await db.query(`INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [staff.id, message, activity, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    }
  } catch(error) {
    console.error("Error in verifyOrUnverify:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, status } = req.query

  if (req.method === 'PUT') {
    try {
      await verifyOrUnverify(Number(id), String(status), session)
      res.status(200).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
