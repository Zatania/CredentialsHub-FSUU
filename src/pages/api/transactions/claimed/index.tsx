import { NextApiResponse, NextApiRequest } from 'next/types'
import dayjs from 'dayjs'
import db from '../../../db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, staff_id, user_id } = req.body

    if (!id) {
      return res.status(400).json({ error: 'Missing ID in request' })
    }

    await db.query('UPDATE transactions SET status = "Claimed" WHERE id = ?', [id])

    await db.query(
      'INSERT INTO transaction_history (transaction_id, user_id, staff_id, action, date) VALUES (?, ?, ?, ?, ?)',
      [id, user_id, staff_id, 'Claimed', dayjs().format('YYYY-MM-DD')]
    )

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
