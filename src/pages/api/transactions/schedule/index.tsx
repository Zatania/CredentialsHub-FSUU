import { NextApiResponse, NextApiRequest } from 'next/types'
import dayjs from 'dayjs'
import db from '../../db'

interface Transaction {
  id: number
  user_id: number
  dateFilled: string
  transcriptCopies: number
  transcriptSchedule: string
  dismissalCopies: number
  dismissalSchedule: string
  moralCharacterCopies: number
  moralCharacterSchedule: string
  diplomaCopies: number
  diplomaSchedule: string
  authenticationCopies: number
  authenticationSchedule: string
  courseDescriptionCopies: number
  courseDescriptionSchedule: string
  certificationType: string
  certificationCopies: number
  certificationSchedule: string
  cavRedRibbonCopies: number
  cavRedRibbonSchedule: string
  totalAmount: number
  purpose: string
  status: string
  [key: string]: any
}

const updateSchedule = async (id: number, transactionFields: Transaction, staff_id: number) => {
  const keys = Object.keys(transactionFields)
  const values = keys.map(key => {
    // Check if the key ends with "Schedule"
    if (key.endsWith('Schedule')) {
      // Format the value using dayjs
      return dayjs(transactionFields[key]).format('YYYY-MM-DD')
    } else {
      return transactionFields[key]
    }
  })

  const setArray = [...keys].map(key => `${key} = ?`)
  const updateSet = setArray.join(', ')
  const statusSched = `'Scheduled'`

  try {
    await db.query(`UPDATE transactions SET ${updateSet}, status = ${statusSched}  WHERE id = ${id}`, [...values])

    await db.query(
      'INSERT INTO transaction_history (transaction_id, user_id, staff_id, action, date) VALUES (?, ?, ?, ?, ?)',
      [id, transactionFields.user_id, staff_id, 'Scheduled', dayjs().format('YYYY-MM-DD')]
    )
  } catch (error) {
    throw error
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, staff_id, ...formData } = req.body

    if (!id) {
      return res.status(400).json({ error: 'Missing ID in request' })
    }

    await updateSchedule(id, formData, staff_id)

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
