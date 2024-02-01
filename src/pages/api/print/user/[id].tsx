import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

interface User {
  id: number
  username: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: string
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
  academicHonor: string
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
}

async function fetchUserDetails(id: number): Promise<any[]> {
  try {
    const queryResult = await db.query(`
      SELECT
        *
      FROM users u
      WHERE u.id = ?;
    `, [id]);

    const data = queryResult as RowDataPacket[];

    const results = data[0].map((user: User) => ({
      id: user.id,
      username: user.username,
      studentNumber: user.studentNumber,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      department: user.department,
      course: user.course,
      major: user.major,
      graduateCheck: user.graduateCheck,
      graduationDate: user.graduationDate,
      academicHonor: user.academicHonor,
      yearLevel: user.yearLevel,
      schoolYear: user.schoolYear,
      semester: user.semester,
      homeAddress: user.homeAddress,
      contactNumber: user.contactNumber,
      emailAddress: user.emailAddress,
      birthDate: dayjs(user.birthDate).format('YYYY-MM-DD'),
      birthPlace: user.birthPlace,
      religion: user.religion,
      citizenship: user.citizenship,
      sex: user.sex,
      fatherName: user.fatherName,
      motherName: user.motherName,
      guardianName: user.guardianName,
      elementary: user.elementary,
      elementaryGraduated: dayjs(user.elementaryGraduated).format('YYYY-MM-DD'),
      secondary: user.secondary,
      secondaryGraduated: dayjs(user.secondaryGraduated).format('YYYY-MM-DD'),
      juniorHigh: user.juniorHigh,
      juniorHighGraduated: dayjs(user.juniorHighGraduated).format('YYYY-MM-DD'),
      seniorHigh: user.seniorHigh,
      seniorHighGraduated: dayjs(user.seniorHighGraduated).format('YYYY-MM-DD'),
      tertiary: user.tertiary,
      tertiaryGraduated: dayjs(user.tertiaryGraduated).format('YYYY-MM-DD'),
      employedAt: user.employedAt,
      position: user.position,
    }))

    return results;
  } catch(error) {
    console.error(error)
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const data = await fetchUserDetails(Number(id));

      res.status(200).json(data);
    } catch (error) {
      console.error("Error in handler:", error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
