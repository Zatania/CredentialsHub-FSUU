import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import dayjs from 'dayjs'
import { RowDataPacket } from 'mysql2';

async function addTransaction(packageId, userId, totalAmount, credentials) {
  try {
    const transactionDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const status = 'Submitted';

    // Insert into transactions table
    const [transaction] = await db.query(`INSERT INTO transactions (user_id, total_amount, transaction_date, status) VALUES (?, ?, ?, ?)`, [userId, totalAmount, transactionDate, status]) as RowDataPacket[]
    const transactionId = transaction.insertId;

    if (packageId !== 'others') {
      // Handle package transaction
      await db.query(`INSERT INTO package_transactions (transaction_id, package_id) VALUES (?, ?)`, [transactionId, packageId]);
    } else {
      // Handle individual credentials transaction
      for (const cred of credentials) {
        const subtotal = cred.quantity * cred.price;
        await db.query(`INSERT INTO transaction_details (transaction_id, credential_id, quantity, subtotal) VALUES (?, ?, ?, ?)`, [transactionId, cred.credentialId, cred.quantity, subtotal]);
      }
    }

    await db.query('INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [userId, `User has submitted a new transaction.`, 'Transaction', dayjs().format('YYYY-MM-DD HH:mm:ss')])

    return 'success';
  } catch (error) {
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Extract user ID and total amount from the request body or session
      const userId = req.body.userId || req.session.userId; // Adjust according to how you're storing the user's ID
      const totalAmount = req.body.totalAmount; // Make sure this is passed in the request body
      const packageId = req.body.packageId; // Make sure this is passed in the request body
      const credentials = packageId === 'others' ? req.body.credentials : [];

      await addTransaction(packageId, userId, totalAmount, credentials);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
