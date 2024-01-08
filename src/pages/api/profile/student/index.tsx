import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body
  try {
    const [result] = (await db.query(
      `SELECT users.*, department.name
    FROM users
    LEFT JOIN department ON users.department = department.id
    WHERE users.id = ?`,
      [id]
    )) as RowDataPacket[]
    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Extract the department name from the result
    const { name, ...userData } = result[0]

    // Replace the department ID with the department name in the result
    const resultWithDepartmentName = {
      ...userData,
      department: name
    }

    res.status(200).json(resultWithDepartmentName)
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
