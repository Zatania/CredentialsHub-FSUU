import { NextApiResponse, NextApiRequest } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import db from '../../../db'

interface TransactionData {
  user_id: number
  dateFilled: string
  transcriptCopies: number
  dismissalCopies: number
  moralCharacterCopies: number
  diplomaCopies: number
  authenticationCopies: number
  courseDescriptionCopies: number
  certificationType: string
  certificationCopies: number
  cavRedRibbonCopies: number
  totalAmount: number
  purpose: string
}

const insertTransaction = async (transaction: TransactionData) => {
  const {
    user_id,
    dateFilled,
    transcriptCopies,
    dismissalCopies,
    moralCharacterCopies,
    diplomaCopies,
    authenticationCopies,
    courseDescriptionCopies,
    certificationType,
    certificationCopies,
    cavRedRibbonCopies,
    totalAmount,
    purpose
  } = transaction

  try {
    const [rows] = (await db.query(
      'INSERT INTO transactions (user_id, dateFilled, transcriptCopies, dismissalCopies, moralCharacterCopies, diplomaCopies, authenticationCopies, courseDescriptionCopies, certificationType, certificationCopies, cavRedRibbonCopies, totalAmount, status, purpose) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user_id,
        dateFilled,
        transcriptCopies,
        dismissalCopies,
        moralCharacterCopies,
        diplomaCopies,
        authenticationCopies,
        courseDescriptionCopies,
        certificationType,
        certificationCopies,
        cavRedRibbonCopies,
        totalAmount,
        'Submitted',
        purpose
      ]
    )) as RowDataPacket[]

    return rows[0] || null
  } catch (error) {
    console.log(error)
  }
}

const insertUserLog = async (user_id: number, activity: string, date: string) => {
  try {
    const [userRows] = (await db.query('SELECT firstName, lastName FROM users WHERE id = ?', [
      user_id
    ])) as RowDataPacket[]
    const user = userRows[0]

    // Create the full name
    const fullName = user ? `${user.firstName} ${user.lastName}` : ''

    // Insert into user_logs with the updated activity log
    await db.query('INSERT INTO user_logs (user_id, activity, date) VALUES (?, ?, ?)', [
      user_id,
      `${fullName} ${activity}`,
      date
    ])
  } catch (error) {
    console.error('Error inserting user log:', error)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body

  try {
    const transaction = await insertTransaction(data)

    // Insert into user_logs after successfully inserting the transaction
    await insertUserLog(data.user_id, 'has created a new transaction.', data.dateFilled)

    return res.status(200).json(transaction)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    } else {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default handler
