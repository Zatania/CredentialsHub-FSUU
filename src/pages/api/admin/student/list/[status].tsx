import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
  middleName: string
  lastName: string
  department: string
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
  yearLevel: string
  schoolYear: string
  semester: string
  homeAddress: string
  contactNumber: string
  emailAddress: string
  birthDate: string
  birthPlace: string
  religion: string
  citizenship: string
  sex: string
  fatherName: string
  motherName: string
  guardianName: string
  elementary: string
  elementaryGraduated: string
  secondary: string
  secondaryGraduated: string
  juniorHigh: string
  juniorHighGraduated: string
  seniorHigh: string
  seniorHighGraduated: string
  tertiary: string
  tertiaryGraduated: string
  employedAt: string
  position: string
  image: string
  status: string
  remarks: string
}

async function fetchStudents(status: string) {
  try {
    const results = (await db.query(`
    SELECT *
      FROM users AS u
      INNER JOIN department AS d ON u.department = d.id
      WHERE u.status = ?
    `, [status])) as RowDataPacket;

    const rows = results[0].map((row: StudentData) => ({
      id: row.id,
      studentNumber: row.studentNumber,
      firstName: row.firstName,
      middleName: row.middleName,
      lastName: row.lastName,
      department: row.department,
      course: row.course,
      major: row.major,
      graduateCheck: row.graduateCheck,
      graduationDate: row.graduationDate,
      yearLevel: row.yearLevel,
      schoolYear: row.schoolYear,
      semester: row.semester,
      homeAddress: row.homeAddress,
      contactNumber: row.contactNumber,
      emailAddress: row.emailAddress,
      birthDate: row.birthDate,
      birthPlace: row.birthPlace,
      religion: row.religion,
      citizenship: row.citizenship,
      sex: row.sex,
      fatherName: row.fatherName,
      motherName: row.motherName,
      guardianName: row.guardianName,
      elementary: row.elementary,
      elementaryGraduated: row.elementaryGraduated,
      secondary: row.secondary,
      secondaryGraduated: row.secondaryGraduated,
      juniorHigh: row.juniorHigh,
      juniorHighGraduated: row.juniorHighGraduated,
      seniorHigh: row.seniorHigh,
      seniorHighGraduated: row.seniorHighGraduated,
      tertiary: row.tertiary,
      tertiaryGraduated: row.tertiaryGraduated,
      employedAt: row.employedAt,
      position: row.position,
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
