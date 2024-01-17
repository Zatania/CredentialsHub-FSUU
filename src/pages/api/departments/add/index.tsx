import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'

interface DepartmentsData {
  id: number
  name: string
}

async function addDepartment(data: DepartmentsData) {
  try {
    await db.query(`INSERT INTO department (name) VALUES (?)`, [data.name])

    return 'success'
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await addDepartment(req.body);
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
