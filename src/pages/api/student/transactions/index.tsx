import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'
import { getSession } from 'next-auth/react'

async function queryTransactionsBasedOnStatus(status: string, id: number) {
  const [transactions] = (await db.query(`
    SELECT * FROM transactions WHERE status = ? AND user_id = ? ORDER BY transaction_date DESC
  `, [status, id])) as RowDataPacket[]

  return transactions
}

async function formatPackageTransaction(packageTransaction) {
  const [packages] = (await db.query(`
    SELECT * FROM packages WHERE id = ?
  `, [packageTransaction.package_id])) as RowDataPacket[]

  const [packageContents] = (await db.query(`
    SELECT * FROM package_contents WHERE package_id = ?
  `, [packageTransaction.package_id])) as RowDataPacket[]

  const credentials = await Promise.all(packageContents.map(async (content) => {
    const [credential] = (await db.query(`
      SELECT * FROM credentials WHERE id = ?
    `, [content.credential_id])) as RowDataPacket[]

    return {
      id: credential[0].id,
      name: credential[0].name,
      price: credential[0].price,
      quantity: content.quantity
    }
  }))

  return {
    package: {
      id: packages[0].id,
      name: packages[0].name,
      description: packages[0].description,
      credentials
    }
  }
}

async function formatIndividualCredential(detail) {
  const [credential] = (await db.query(`
    SELECT * FROM credentials WHERE id = ?
  `, [detail.credential_id])) as RowDataPacket[]

  return {
    id: credential[0].id,
    name: credential[0].name,
    price: credential[0].price,
    quantity: detail.quantity,
    subtotal: detail.subtotal
  }
}

async function formatData(transactions) {
  return Promise.all(transactions.map(async (transaction) => {
    const [packageTransactions] = (await db.query(`
      SELECT * FROM package_transactions WHERE transaction_id = ?
    `, [transaction.id])) as RowDataPacket[]

    const [individualTransactions] = (await db.query(`
      SELECT * FROM transaction_details WHERE transaction_id = ?
    `, [transaction.id])) as RowDataPacket[]

    let packageDetails = []
    let individualDetails = []

    if (packageTransactions.length > 0) {
      packageDetails = await Promise.all(packageTransactions.map(formatPackageTransaction))
    }

    if (individualTransactions.length > 0) {
      individualDetails = await Promise.all(individualTransactions.map(formatIndividualCredential))
    }

    return {
      id: transaction.id,
      user_id: transaction.user_id,
      total_amount: transaction.total_amount,
      transaction_date: transaction.transaction_date,
      status: transaction.status,
      image: transaction.attachment,
      schedule: transaction.schedule,
      remarks: transaction.remarks,
      claim: transaction.claim,
      claimed_remarks: transaction.claimed_remarks,
      reject: transaction.reject,
      rejected_remarks: transaction.rejected_remarks,
      packages: packageDetails,
      individualCredentials: individualDetails
    }
  }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const id = session.user.id
  const statuses = ['Submitted', 'Scheduled', 'Claimed', 'Rejected']; // Define the statuses

  if (req.method === 'GET') {
    try {
      const allTransactions = {};

      for (const status of statuses) {
        const transactions = await queryTransactionsBasedOnStatus(status, id);
        allTransactions[status] = await formatData(transactions);
      }

      res.status(200).json(allTransactions); // Send all transactions in a single response
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
