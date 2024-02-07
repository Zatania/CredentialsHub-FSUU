import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import db from '../../../db'

interface SAData {
  id: number
  username: string
  password: string
  sa_number: number
  firstName: string
  middleName: string
  lastName: string
  address: string
  role: 'Scheduling' | 'Releasing'
}

const insertSA = async (data: SAData, departments: number[]) => {
  const { username, password, sa_number, firstName, middleName, lastName, address, role } = data

  try {
    const [rows] = (await db.query(
      `
        INSERT INTO student_assistants (username, password, sa_number, firstName, middleName, lastName, address, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [username, password, sa_number, firstName, middleName, lastName, address, role]
    )) as RowDataPacket[]

    const sa_id = rows.insertId

    await db.query('INSERT INTO student_assistants_roles (sa_id, role_id) VALUES (?, ?)', [sa_id, 4])

    const departmentValues = departments.map(department => [sa_id, department])
    await db.query('INSERT INTO student_assistants_departments (sa_id, department_id) VALUES ?', [departmentValues])

    return rows[0] || null
  } catch (error) {
    console.error('SQL Error:', error)
    throw error
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, departments } = req.body
  try {
    const sa = await insertSA(data, departments)

    return res.status(200).json(sa)
  } catch (error) {
    console.error('API Error:', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
