import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body
  try {
    // Fetch staff data
    const [result] = (await db.query(`SELECT * FROM staffs WHERE id =?`, [id])) as RowDataPacket[]
    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(result[0])
  } catch (error) {
    console.error('Error fetching staff details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
