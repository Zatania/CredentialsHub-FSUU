import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import { getSession } from 'next-auth/react'

interface StudentData {
  id: number
  studentNumber: number
  firstName: string
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

async function fetchStaffDepartments(staffId: number) {
  const results = (await db.query(`
    SELECT department_id FROM staffs_departments WHERE staff_id = ?
  `, [staffId])) as RowDataPacket;

  return results[0].map((row: any) => row.department_id);
}

async function fetchStudents(status: string, departments: number[]) {
  try {
    const results = (await db.query(`
    SELECT u.id, u.studentNumber, u.firstName, u.middleName, u.lastName, d.name AS department, u.course, u.major, u.graduateCheck, u.graduationDate, u.academicHonor, u.yearLevel, u.schoolYear, u.semester, u.homeAddress, u.contactNumber, u.emailAddress, u.birthDate, u.birthPlace, u.religion, u.citizenship, u.sex, u.fatherName, u.motherName, u.guardianName, u.elementary, u.elementaryGraduated, u.secondary, u.secondaryGraduated, u.juniorHigh, u.juniorHighGraduated, u.seniorHigh, u.seniorHighGraduated, u.tertiary, u.tertiaryGraduated, u.employedAt, u.position, u.image, u.status, u.remarks
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
