import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'
import { getSession } from 'next-auth/react'

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
  lastName: string
  department: string
  course: string
  contactNumber: string
  emailAddress: string
  image: string
  status: string
}

async function fetchStaffDepartments(staffId: number) {
  const results = (await db.query(`
    SELECT department_id FROM staffs_departments WHERE staff_id = ?
  `, [staffId])) as RowDataPacket;

  return results[0].map((row: any) => row.department_id);
}

async function fetchStudents(status: string, departments: number[]) {
  try {
    const results = (await db.query(`
      SELECT u.id, u.studentNumber, u.firstName, u.lastName, d.name AS department, u.course, u.image, u.status, u.emailAddress, u.contactNumber
      FROM users AS u
      INNER JOIN department AS d ON u.department = d.id
      WHERE u.status = ? AND d.id IN (?)
    `, [status, departments])) as RowDataPacket;

    const rows = results[0].map((row: StudentData) => ({
      id: row.id,
      studentNumber: row.studentNumber,
      firstName: row.firstName,
      lastName: row.lastName,
      department: row.department,
      course: row.course,
      contactNumber: row.contactNumber,
      emailAddress: row.emailAddress,
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
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const staffId = session.user.id;
  const { status } = req.query

  if (req.method === 'GET') {
    try {
      const departments = await fetchStaffDepartments(staffId);
      const students = await fetchStudents(String(status), departments);
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
