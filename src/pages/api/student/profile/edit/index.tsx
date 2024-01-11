import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import dayjs from 'dayjs'
import db from '../../../../db'

interface User {
  user_id: number
  username: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  department: number
  course: string
  major: string
  graduateCheck: string
  graduationDate: string | null
  academicHonor: string
  yearLevel: string
  schoolYear: string
  semester: string
  homeAddress: string
  contactNumber: string
  emailAddress: string
  birthDate: string | null
  birthPlace: string
  religion: string
  citizenship: string
  sex: string
  fatherName: string
  motherName: string
  guardianName: string
  elementary: string
  elementaryGraduated: string | null
  secondary: string
  secondaryGraduated: string | null
  juniorHigh: string
  juniorHighGraduated: string | null
  seniorHigh: string
  seniorHighGraduated: string | null
  tertiary: string
  tertiaryGraduated: string | null
  employedAt: string
  position: string
  [key: string]: string | number | null
}

interface NextApiRequestWithUser extends NextApiRequest {
  body: User
}

// Function to format date values
const formatDateValues = (userData: User) => {
  const formattedUserData = { ...userData }

  const dateFields = [
    'birthDate',
    'graduationDate',
    'elementaryGraduated',
    'secondaryGraduated',
    'juniorHighGraduated',
    'seniorHighGraduated',
    'tertiaryGraduated'
  ]

  dateFields.forEach(field => {
    if (formattedUserData[field]) {
      formattedUserData[field] = dayjs(formattedUserData[field]).format('YYYY-MM-DD')
    } else {
      formattedUserData[field] = null // Set to NULL if the field is an empty string
    }
  })

  return formattedUserData
}

const updateUser = async (userData: User) => {
  const formattedUserData = formatDateValues(userData)

  const {
    user_id,
    username,
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
    homeAddress,
    contactNumber,
    emailAddress,
    birthDate,
    birthPlace,
    religion,
    citizenship,
    sex,
    fatherName,
    motherName,
    guardianName,
    elementary,
    elementaryGraduated,
    secondary,
    secondaryGraduated,
    juniorHigh,
    juniorHighGraduated,
    seniorHigh,
    seniorHighGraduated,
    tertiary,
    tertiaryGraduated,
    employedAt,
    position
  } = formattedUserData

  try {
    const [rows] = (await db.query(
      'UPDATE users SET studentNumber = ?, firstName = ?, middleName = ?, lastName = ?, department = ?, course = ?, major = ?, graduateCheck = ?, graduationDate = ?, academicHonor = ?, yearLevel = ?, schoolYear = ?, semester = ?, homeAddress = ?, contactNumber = ?, emailAddress = ?, birthDate = ?, birthPlace = ?, religion = ?, citizenship = ?, sex = ?, fatherName = ?, motherName = ?, guardianName = ?, elementary = ?, elementaryGraduated = ?, secondary = ?, secondaryGraduated = ?, juniorHigh = ?, juniorHighGraduated = ?, seniorHigh = ?, seniorHighGraduated = ?, tertiary = ?, tertiaryGraduated = ?, employedAt = ?, position = ? WHERE username = ?',
      [
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
        homeAddress,
        contactNumber,
        emailAddress,
        birthDate,
        birthPlace,
        religion,
        citizenship,
        sex,
        fatherName,
        motherName,
        guardianName,
        elementary,
        elementaryGraduated,
        secondary,
        secondaryGraduated,
        juniorHigh,
        juniorHighGraduated,
        seniorHigh,
        seniorHighGraduated,
        tertiary,
        tertiaryGraduated,
        employedAt,
        position,
        username
      ]
    )) as RowDataPacket[]

    // Add to user logs
    await db.query('INSERT INTO user_logs (user_id, activity, date) VALUES (?, ?, ?)', [user_id, 'Student Information Edited.', dayjs().format('YYYY-MM-DD')])

    return rows[0] || null
  } catch (error) {
    console.log(error)
  }
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const data = req.body;

  console.log("API")
  try {
    const user = await updateUser(data)

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
