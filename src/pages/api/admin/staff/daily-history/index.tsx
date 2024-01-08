import { NextApiRequest, NextApiResponse } from 'next/types'
import dayjs from 'dayjs'
import db from '../../../../db'
import { RowDataPacket } from 'mysql2'

interface TransactionHistory {
  id: number
  transaction_id: number
  user_id: number
  staff_id: number
  action: string
  date: string
}

interface User {
  id: number
  firstName: string
  lastName: string
}

interface Staff {
  id: number
  firstName: string
  lastName: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD')
    const results = (await db.query('SELECT * FROM transaction_history WHERE date = ?', [currentDate])) as RowDataPacket

    console.log(results)

    // Map the rows to the desired format
    const rows = await Promise.all(
      results[0].map(async (row: TransactionHistory) => {
        // Query the users table to get firstname and lastname using user_id
        const userResults = (await db.query('SELECT firstName, lastName FROM users WHERE id = ?', [
          row.user_id
        ])) as RowDataPacket
        const user = userResults[0][0] as User

        // Query the staffs table to get firstname and lastname using staff_id
        const staffResults = (await db.query('SELECT firstName, lastName FROM staffs WHERE id = ?', [
          row.staff_id
        ])) as RowDataPacket
        const staff = staffResults[0][0] as Staff

        return {
          id: row.id,
          transaction_id: row.transaction_id,
          user_id: row.user_id,
          staff_id: row.staff_id,
          action: row.action,
          date: row.date,
          user: {
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName
          },
          staff: {
            id: staff.id,
            firstname: staff.firstName,
            lastname: staff.lastName
          }
        }
      })
    )

    // Send the response as a single array
    res.status(200).json(rows)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
