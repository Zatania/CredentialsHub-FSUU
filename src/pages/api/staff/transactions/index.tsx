import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import { getSession } from 'next-auth/react'

// Function to fetch user details
async function fetchUserDetails(userId: number) {
  const [userDetails] = (await db.query(`
    SELECT * FROM users WHERE id = ?
  `, [userId])) as RowDataPacket[]

  return userDetails.length > 0 ? userDetails[0] : null
}

async function fetchStaffDepartments(staffId: number) {
  const [results] = (await db.query(`
    SELECT department_id FROM staffs_departments WHERE staff_id = ?
  `, [staffId])) as RowDataPacket[]

  return results.map((row: any) => row.department_id)
}

async function queryTransactionsBasedOnStatus(status: string, departments: number[]) {
  const [transactions] = (await db.query(`
    SELECT t.* FROM transactions t
    INNER JOIN users u ON t.user_id = u.id
    WHERE t.status = ? AND u.department IN (?)
    ORDER BY t.transaction_date DESC
  `, [status, departments])) as RowDataPacket[]

  return transactions
}

async function formatPackageTransaction(packageTransaction) {
  const [packages] = (await db.query(`
    SELECT * FROM packages WHERE id = ?
  `, [packageTransaction.package_id])) as RowDataPacket[]

  const [packageContents] = (await db.query(`
    SELECT * FROM package_contents WHERE package_id = ?
  `, [packageTransaction.package_id])) as RowDataPacket[]

  const credentials = await Promise.all(packageContents.map(async (content: any) => {
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

async function formatIndividualCredential(detail: any) {
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

async function formatData(transactions: any[]) {
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

    // Fetch and add user details
    const userDetails = await fetchUserDetails(transaction.user_id)
    if (userDetails) {
      transaction.firstName = userDetails.firstName
      transaction.middleName = userDetails.middleName
      transaction.lastName = userDetails.lastName
      transaction.course = userDetails.course
      transaction.major = userDetails.major
      transaction.graduateCheck = userDetails.graduateCheck
      transaction.graduationDate = userDetails.graduationDate
      transaction.yearLevel = userDetails.yearLevel
      transaction.schoolYear = userDetails.schoolYear
      transaction.semester = userDetails.semester
    }

    return {
      id: transaction.id,
      user_id: transaction.user_id,
      firstName: transaction.firstName,
      middleName: transaction.middleName,
      lastName: transaction.lastName,
      course: transaction.course,
      major: transaction.major,
      graduateCheck: transaction.graduateCheck,
      graduationDate: transaction.graduationDate,
      yearLevel: transaction.yearLevel,
      schoolYear: transaction.schoolYear,
      semester: transaction.semester,
      total_amount: transaction.total_amount,
      transaction_date: transaction.transaction_date,
      status: transaction.status,
      image: transaction.attachment,
      payment_date: transaction.payment_date,
      schedule: transaction.schedule,
      task_done: transaction.task_done,
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
  const statuses = ['Submitted', 'Scheduled', 'Claimed', 'Rejected', 'Ready'] // Define the statuses
  const session = await getSession({ req })
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const staffId = session.user.id

  if (req.method === 'GET') {
    try {
      const allTransactions = {}
      const departments = await fetchStaffDepartments(staffId)

      for (const status of statuses) {
        const transactions = await queryTransactionsBasedOnStatus(status, departments)
        allTransactions[status] = await formatData(transactions)
      }

      res.status(200).json(allTransactions) // Send all transactions in a single response
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
