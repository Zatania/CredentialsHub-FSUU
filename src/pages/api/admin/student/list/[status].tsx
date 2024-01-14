import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../../db'
import { RowDataPacket } from 'mysql2'

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
  lastName: string
  department: string
  course: string
  image: string
  status: string
}

async function fetchStudents(status: string) {
  try {
    const results = (await db.query(`SELECT * FROM users WHERE status = ?`, [status])) as RowDataPacket

    const rows = results[0].map((row: StudentData) => ({
      id: row.id,
      studentNumber: row.studentNumber,
      firstName: row.firstName,
      lastName: row.lastName,
      department: row.department,
      course: row.course,
      image: row.image,
      status: row.status
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
  const { status } = req.query

  if (req.method === 'GET') {
    try {
      const students = await fetchStudents(String(status))
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
