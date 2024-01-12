import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
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

async function fetchStudents() {
  const results = (await db.query(`
    SELECT u.id, u.studentNumber, u.firstName, u.lastName, d.name AS department, u.course, u.image, u.status
    FROM users AS u
    INNER JOIN department AS d ON u.department = d.id
  `)) as RowDataPacket;

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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const students = await fetchStudents()
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
