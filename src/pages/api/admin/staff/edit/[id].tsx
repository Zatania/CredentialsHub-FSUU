import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

async function updateStaff(id: number, staffData: any) {
  try {
    // Update staff basic information
    const updateQuery = 'UPDATE staffs SET employeeNumber = ?, username = ?, firstName = ?, middleName = ?, lastName = ?, address = ? WHERE id = ?'
    await db.query(updateQuery, [staffData.employeeNumber, staffData.username, staffData.firstName, staffData.middleName, staffData.lastName, staffData.address, id])

    // Update staff departments
    // First, clear existing departments associations for the staff
    await db.query('DELETE FROM staffs_departments WHERE staff_id = ?', [id])

    // Then, insert new department associations
    const departmentInsertQuery = 'INSERT INTO staffs_departments (staff_id, department_id) VALUES ?'
    const departmentValues = staffData.departments.map((departmentId: any) => [id, departmentId])
    if (departmentValues.length > 0) {
      await db.query(departmentInsertQuery, [departmentValues])
    }

    return
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const data = req.body
      await updateStaff(Number(id), data)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
