import type { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../db'
import dayjs from 'dayjs'

type Data = {
  message: string
  error?: string
}

type RequestBody = {
  scheduleDate: string
  remarks: string
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
      const { scheduleDate, remarks, user } = req.body as RequestBody

      // Update the transaction in the database
      await db.query('UPDATE transactions SET schedule = ?, schedule_done =?, remarks = ?, status = ? WHERE id = ?', [dayjs(scheduleDate).format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss'), remarks, 'Scheduled', id])

      // Add to transaction_history
      await db.query('INSERT INTO transaction_history (transaction_id, staff_id) VALUES (?, ?)', [id, user.id])

      const message = `${user.firstName} ${user.lastName} successfully scheduled a transaction request.`
      const activity = `Scheduled Transaction`

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
