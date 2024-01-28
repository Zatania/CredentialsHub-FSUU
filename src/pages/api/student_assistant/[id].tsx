import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../db'
import { RowDataPacket } from 'mysql2'

async function fetchDetails(id: number) {
  try {
    const [data] = await db.query(
      `SELECT * FROM student_assistants WHERE id = ?`,
      [id]
    ) as RowDataPacket[]

    const rows = data.map((row: any) => ({
      id: row.id,
      sa_number: row.sa_number,
      firstName: row.firstName,
      middleName: row.middleName,
      lastName: row.lastName,
      address: row.address,
      role: row.role,
    }))

    return rows
  } catch(error) {
    throw error
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const result = await fetchDetails(Number(id))

      res.status(200).json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
