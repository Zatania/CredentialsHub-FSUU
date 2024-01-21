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
  graduateCheck: string
  graduationDate: string
  yearLevel: string
  schoolYear: string
  semester: string
  contactNumber: string
  emailAddress: string
  image: string
  status: string
  remarks: string
}

async function fetchStudents(status: string) {
  try {
    const results = (await db.query(`
    SELECT u.id, u.studentNumber, u.firstName, u.lastName, d.name AS department, u.course, u.image, u.status, u.emailAddress, u.contactNumber, u.graduateCheck, u.graduationDate, u.yearLevel, u.schoolYear, u.semester, u.remarks
      FROM users AS u
      INNER JOIN department AS d ON u.department = d.id
      WHERE u.status = ?
    `, [status])) as RowDataPacket;

    const rows = results[0].map((row: StudentData) => ({
      id: row.id,
      studentNumber: row.studentNumber,
      firstName: row.firstName,
      lastName: row.lastName,
      department: row.department,
      course: row.course,
      graduateCheck: row.graduateCheck,
      graduationDate: row.graduationDate,
      yearLevel: row.yearLevel,
      schoolYear: row.schoolYear,
      semester: row.semester,
      contactNumber: row.contactNumber,
      emailAddress: row.emailAddress,
      image: row.image,
      status: row.status,
      remarks: row.remarks
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
