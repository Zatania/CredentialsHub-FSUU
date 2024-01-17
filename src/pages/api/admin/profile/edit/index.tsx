import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import dayjs from 'dayjs'
import db from '../../../db'

interface Staff {
  id: number
  username: string
  firstName: string
  middleName: string
  lastName: string
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
  } = userData

  try {
    const [rows] = (await db.query(
      'UPDATE admins SET username = ?, firstName = ?, middleName = ?, lastName = ? WHERE id = ?',
      [
        username,
        firstName,
        middleName,
        lastName,
        id
      ]
    )) as RowDataPacket[]

    // Add to user logs
    await db.query('INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [id, 'Admin Information Edited.', 'Profile Edit', dayjs().format('YYYY-MM-DD HH:mm:ss')])

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
