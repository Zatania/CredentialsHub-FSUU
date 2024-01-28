import { NextApiResponse, NextApiRequest } from 'next/types'
import db from '../db'
import dayjs from 'dayjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { user } = req.body

      if (user.role === 'student') {
        await db.query('INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user.id, `${user.firstName} ${user.lastName} logged out succesfully.`, 'Logout', dayjs().format('YYYY-MM-DD HH:mm:ss')])
      } else if (user.role === 'staff') {
        await db.query('INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user.id, `${user.firstName} ${user.lastName} logged out succesfully.`, 'Logout', dayjs().format('YYYY-MM-DD HH:mm:ss')])
      } else if (user.role === 'admin') {
        await db.query('INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user.id, `${user.firstName} ${user.lastName} logged out succesfully.`, 'Logout', dayjs().format('YYYY-MM-DD HH:mm:ss')])
      } else if (user.role === 'student_assistant') {
        await db.query('INSERT INTO student_assistants_logs (sa_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user.id, `${user.firstName} ${user.lastName} logged out succesfully.`, 'Logout', dayjs().format('YYYY-MM-DD HH:mm:ss')])
      }

      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
