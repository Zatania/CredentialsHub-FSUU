import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../../db'
import { RowDataPacket } from 'mysql2'

async function fetchStaffs() {
  // Query to get staffs along with their departments
  const results = (await db.query(`
    SELECT s.id, s.username, s.employeeNumber, s.firstName, s.middleName, s.lastName, s.address, d.name AS department
    FROM staffs AS s
    LEFT JOIN staffs_departments AS sd ON s.id = sd.staff_id
    LEFT JOIN department AS d ON sd.department_id = d.id
  `)) as RowDataPacket;

  // Transforming the result to group departments under each staff
  const staffsMap = new Map();
  results[0].forEach((row: any) => {
    if (!staffsMap.has(row.id)) {
      staffsMap.set(row.id, {
        ...row,
        departments: row.department ? [row.department] : []
      });
    } else {
      const staff = staffsMap.get(row.id);
      if (row.department) {
        staff.departments.push(row.department);
      }
    }
  });

  return Array.from(staffsMap.values());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const staffs = await fetchStaffs()
      res.status(200).json(staffs)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
