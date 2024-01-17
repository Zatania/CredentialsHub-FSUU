import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import dayjs from 'dayjs'

async function updateTransaction(id: number, data: any, user: any) {
  try {
    if(data.payment_date && data.imagePath) {
      await db.query(`UPDATE transactions SET payment_date = ?, attachment = ? WHERE id = ?`, [dayjs(data.payment_date).format('YYYY-MM-DD'), data.imagePath, id])
      const message = `${user.firstName} ${user.lastName} has updated an individual credential transaction.`
      await db.query(`INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Update Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else if (data.payment_date && !data.imagePath) {
      await db.query(`UPDATE transactions SET payment_date = ? WHERE id = ?`, [dayjs(data.payment_date).format('YYYY-MM-DD'), id])
      const message = `${user.firstName} ${user.lastName} has updated an individual credential transaction.`
      await db.query(`INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Update Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else if (!data.payment_date && data.imagePath) {
      await db.query(`UPDATE transactions SET attachment = ? WHERE id = ?`, [data.imagePath, id])
      const message = `${user.firstName} ${user.lastName} has updated an individual credential transaction.`
      await db.query(`INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Update Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')])
    }

    return 'Transaction updated successfully'
  } catch(error) {
    console.log(error)
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { credentials, totalAmount, imagePath, user, payment_date } = req.body
      await updateTransaction(Number(id), { credentials, totalAmount, imagePath, payment_date }, user)
      res.status(204).end()
    } catch (error) {
      console.log(error)
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
