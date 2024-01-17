import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import dayjs from 'dayjs'
import db from '../../../../db'

interface Staff {
  id: number
  username: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  [key: string]: string | number | null
}

interface NextApiRequestWithUser extends NextApiRequest {
  body: Staff
}

const updateUser = async (userData: Staff) => {
  const {
    id,
    username,
    firstName,
    middleName,
    lastName,
    address
  } = userData

  try {
    const [rows] = (await db.query(
      'UPDATE staffs SET username = ?, firstName = ?, middleName = ?, lastName = ?, address = ? WHERE id = ?',
      [
        username,
        firstName,
        middleName,
        lastName,
        address,
        id
      ]
    )) as RowDataPacket[]

    // Add to user logs
    await db.query('INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [id, 'Staff Information Edited.', 'Profile Edit', dayjs().format('YYYY-MM-DD HH:mm:ss')])

    return rows[0] || null
  } catch (error) {
    console.log(error)
  }
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const data = req.body
  try {
    const user = await updateUser(data)

    return res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    } else {
      console.error(error)

      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default handler
