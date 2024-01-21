import { NextApiRequest, NextApiResponse } from 'next/types'
import dayjs from 'dayjs'
import db from '../../../db'

interface UserImage {
  id: number
  path: string
}
const updateUser = async (data: UserImage) => {
  try {
    await db.query(`UPDATE users SET image = ? WHERE id = ?`, [data.path, data.id])

    // Add to user logs
    await db.query('INSERT INTO user_logs (user_id, activity, date) VALUES (?, ?, ?)', [data.id, 'Student Profile Picture Changed.', dayjs().format('YYYY-MM-DD')])

    return 'success'
  } catch (error) {
    console.log(error)
    console.error(error)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;
  console.log('sent data', data)
  try {
    await updateUser(data)

    return res.status(200).end()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    } else {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default handler
