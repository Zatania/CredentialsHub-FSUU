import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

async function updateSA(id: number, SAData: any) {
  try {
    // Update student assistant's basic information
    const updateQuery = 'UPDATE student_assistants SET username = ?, firstName = ?, middleName = ?, lastName = ?, address = ?, role = ? WHERE id = ?'
    await db.query(updateQuery, [SAData.username, SAData.firstName, SAData.middleName, SAData.lastName, SAData.address, SAData.role, id])

    // Update student assistant's departments
    // First, clear existing departments associations for the student assistant's
    await db.query('DELETE FROM student_assistants_departments WHERE sa_id = ?', [id])

    // Then, insert new department associations
    const departmentInsertQuery = 'INSERT INTO student_assistants_departments (sa_id, department_id) VALUES ?'
    const departmentValues = SAData.departments.map((departmentId: any) => [id, departmentId])
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
      await updateSA(Number(id), data)
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
