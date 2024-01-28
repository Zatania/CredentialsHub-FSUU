import type { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import dayjs from 'dayjs'

type Data = {
  message: string
  error?: string
}

type RequestBody = {
  rejected_remarks: string
  user: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'PUT') {
    // Get the transaction ID from the URL
    const { id } = req.query

    try {
      // Get the data from the request body
      const { rejected_remarks, user } = req.body as RequestBody

      // Update the transaction in the database
      await db.query('UPDATE transactions SET reject = ?, rejected_remarks = ?, status = ? WHERE id = ?', [dayjs().format('YYYY-MM-DD HH:mm:ss'), rejected_remarks, 'Rejected', id])


      const message = `${user.firstName} ${user.lastName} successfully rejected the transaction.`
      const activity = `Rejected Transaction`

      // Insert into staff_logs
      await db.query(`INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, activity, dayjs().format('YYYY-MM-DD HH:mm:ss')])

      // Send a success response
      res.status(200).json({ message: 'Transaction scheduled successfully' })
    } catch (error: any) {
      // Handle any errors
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  } else {
    // If the request method is not PUT
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
