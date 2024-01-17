import { NextApiResponse, NextApiRequest } from 'next/types'
import { RowDataPacket } from 'mysql2/promise'
import * as bcrypt from 'bcryptjs'
import db from '../../db'
import dayjs from 'dayjs'

const comparePasswords = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword)
}

const getUser = async (username: string, password: string, userType: string) => {
  try {
    let query, params

    if (userType === 'Student') {
      query =
        'SELECT users.*, roles.name AS role_name FROM users ' +
        'JOIN users_roles ON users.id = users_roles.user_id ' +
        'JOIN roles ON users_roles.role_id = roles.id ' +
        'WHERE username = ?'
      params = [username]
    } else if (userType === 'Staff') {
      query =
        'SELECT staffs.*, roles.name AS role_name, GROUP_CONCAT(department.name) AS departments FROM staffs ' +
        'JOIN staffs_roles ON staffs.id = staffs_roles.staff_id ' +
        'JOIN roles ON staffs_roles.role_id = roles.id ' +
        'LEFT JOIN staffs_departments ON staffs.id = staffs_departments.staff_id ' +
        'LEFT JOIN department ON staffs_departments.department_id = department.id ' +
        'WHERE username = ? AND is_deleted = FALSE' +
        'GROUP BY staffs.id, roles.name'
      params = [username]
    } else {
      query =
        'SELECT admins.*, roles.name AS role_name FROM admins ' +
        'JOIN admins_roles ON admins.id = admins_roles.admin_id ' +
        'JOIN roles ON admins_roles.role_id = roles.id ' +
        'WHERE username = ?'
      params = [username]
    }
    const rows = (await db.query(query, params)) as RowDataPacket[]

    if (rows.length === 0) {
      return null
    }
    const user = rows[0]

    const hashedPassword = user[0].password

    // Compare the hashed password with the user input password
    const passwordMatch = await comparePasswords(password, hashedPassword)

    if (!passwordMatch) {
      return null
    }
    const message = `${user[0].firstName} ${user[0].lastName} logged in succesfully.`
    const type = 'Login'

    // Add Login to logs
    if (userType === 'Student') {
      await db.query('INSERT INTO user_logs (user_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user[0].id, message, type, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else if (userType === 'Staff') {
      await db.query('INSERT INTO staff_logs (staff_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user[0].id, message, type, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    } else {
      await db.query('INSERT INTO admins_logs (admin_id, activity, activity_type, date) VALUES (?, ?, ?, ?)', [user[0].id, message, type, dayjs().format('YYYY-MM-DD HH:mm:ss')])
    }

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, userType } = req.body

  try {
    const user = await getUser(username, password, userType)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

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
