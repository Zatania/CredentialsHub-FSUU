import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import dayjs from 'dayjs'
import db from '../db'

interface User {
  username: string
  password: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: number
  course: string
  major: string
  graduateCheck: string
  graduationDate: string
  academicHonor: string
  yearLevel: string
  schoolYear: string
  semester: string
  contactNumber: string
  emailAddress: string
  imagePath: string
  [key: string]: string | number | null
}

interface NextApiRequestWithUser extends NextApiRequest {
  body: User
}

const insertUser = async (userData: User) => {
  const {
    username,
    password,
    studentNumber,
    firstName,
    middleName,
    lastName,
    department,
    course,
    major,
    graduateCheck,
    graduationDate,
    academicHonor,
    yearLevel,
    schoolYear,
    semester,
    contactNumber,
    emailAddress,
    imagePath,
  } = userData

  try {
    const [rows] = (await db.query(
      'INSERT INTO users (username, password, studentNumber, firstName, middleName, lastName, department, course, major, graduateCheck, graduationDate, academicHonor, yearLevel, schoolYear, semester, contactNumber, emailAddress, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        username,
        password,
        studentNumber,
        firstName,
        middleName,
        lastName,
        department,
        course,
        major,
        graduateCheck,
        graduationDate,
        academicHonor,
        yearLevel,
        schoolYear,
        semester,
        contactNumber,
        emailAddress,
        imagePath,
        'Unverified'
      ]
    )) as RowDataPacket[]

    const userId = rows.insertId

    // Add the role to the user_roles table
    await db.query('INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)', [userId, 1])

    // Add to user logs
    await db.query('INSERT INTO user_logs (user_id, activity, date) VALUES (?, ?, ?)', [userId, 'User successfully registered and needs verification.', dayjs().format('YYYY-MM-DD HH:mm:ss')])

    return rows[0] || null
  } catch (error) {
    console.log(error)
  }
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const data = req.body

  try {
    const user = await insertUser(data)

    return res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    } else {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}

export default handler
