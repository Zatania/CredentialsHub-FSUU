import { NextApiRequest, NextApiResponse } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import db from '../../../../db'

interface StaffData {
  id: number
  username: string
  password: string
  employeeNumber: number
  firstName: string
  middleName: string
  lastName: string
  address: string
}

const insertStaff = async (data: StaffData, departments: number[]) => {
  const { id, username, password, employeeNumber, firstName, middleName, lastName, address } = data

  try {
    const [rows] = (await db.query(
      `
        INSERT INTO staffs (id, username, password, employeeNumber, firstName, middleName, lastName, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [id, username, password, employeeNumber, firstName, middleName, lastName, address]
    )) as RowDataPacket[]

    const staffID = rows.insertId

    await db.query('INSERT INTO staffs_roles (staff_id, role_id) VALUES (?, ?)', [staffID, 2])

    const departmentValues = departments.map(department => [staffID, department])
    await db.query('INSERT INTO staffs_departments (staff_id, department_id) VALUES ?', [departmentValues])

    return rows[0] || null
  } catch (error) {
    console.error('SQL Error:', error)
    throw error
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, departments } = req.body
  try {
    const staff = await insertStaff(data, departments)

    return res.status(200).json(staff)
  } catch (error) {
    console.error('API Error:', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
