import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'
import { getSession } from 'next-auth/react'

async function updateTransaction(id: number, data: any, user: any) {
  try {
    // Update each credential and its subtotal
    if(data.credentials) {
      for (const credential of data.credentials) {
        const subtotal = credential.quantity * credential.price; // Calculate subtotal
        await db.query(`UPDATE transaction_details SET quantity = ?, subtotal = ? WHERE transaction_id = ? AND credential_id = ?`, [credential.quantity, subtotal, id, credential.id]);
      }
    }

    // Check conditions and perform appropriate update
    if (data.totalAmount && data.imagePath) {
      // Update both total_amount and attachment
      await db.query(`UPDATE transactions SET total_amount = ?, attachment = ? WHERE id = ?`, [data.totalAmount, data.imagePath, id]);
      const message = `${user.firstName} ${user.lastName} has updated an individual credential transaction.`;
      await db.query(`INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Update Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')]);
    } else if (data.totalAmount) {
      // Update only total_amount
      await db.query(`UPDATE transactions SET total_amount = ? WHERE id = ?`, [data.totalAmount, id]);
      const message = `${user.firstName} ${user.lastName} has updated an individual credential transaction's total amount.`;
      await db.query(`INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Update Amount', dayjs().format('YYYY-MM-DD HH:mm:ss')]);
    } else if (data.imagePath) {
      // Update only attachment
      await db.query(`UPDATE transactions SET attachment = ? WHERE id = ?`, [data.imagePath, id]);
      const message = `${user.firstName} ${user.lastName} has added an attachment in a transaction.`;
      await db.query(`INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Image Attachment', dayjs().format('YYYY-MM-DD HH:mm:ss')])
    }

    return 'Transaction updated successfully'
  } catch(error) {
    throw error
  }
}


async function deleteTransaction(id: number, user: any) {
  let transactionType = ''
  try {
    // Check if transaction status is scheduled
    const [transactions] = (await db.query(`SELECT * FROM transactions WHERE id = ?`, [id])) as RowDataPacket[]
    if (transactions.status === 'Scheduled') {
      throw new Error('Transaction is scheduled and cannot be deleted.')
      transactionType = 'package'
    }

    // Check if transaction is package
    const [packageCheck] = (await db.query(`SELECT * FROM package_transactions WHERE transaction_id = ?`, [id])) as RowDataPacket[]
    if (packageCheck.length > 0) {
      await db.query(`DELETE FROM package_transactions WHERE transaction_id = ?`, [id])
      transactionType = 'individual'
    }

    // Check if transaction is individual
    const [individualCheck] = (await db.query(`SELECT * FROM transaction_details WHERE transaction_id = ?`, [id])) as RowDataPacket[]
    if (individualCheck.length > 0) {
      await db.query(`DELETE FROM transaction_details WHERE transaction_id = ?`, [id])
    }

    // Delete transaction
    await db.query(`DELETE FROM transactions WHERE id = ?`, [id])

    let message = ''
    if (transactionType === 'package') {
      message += `${user.firstName} ${user.lastName} has deleted a package transaction.`
    } else if (transactionType === 'individual') {
      message += `${user.firstName} ${user.lastName} has deleted a individual credential transaction.`
    }

    // Add User Log
    await db.query(`INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)`, [user.id, message, 'Delete Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')])

    return 'Success'
  } catch(error) {
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { credentials, totalAmount, imagePath, user } = req.body
      await updateTransaction(Number(id), { credentials, totalAmount, imagePath }, user)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const session = await getSession({ req })
      const user = session.user

      await deleteTransaction(Number(id), user)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      const errorMessage = error.message || 'Internal Server Error'
      res.status(500).json({ message: errorMessage })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
