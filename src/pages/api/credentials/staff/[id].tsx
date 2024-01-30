import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function fetchStaffCredentialsData(id: number): Promise<any[]> {
  try {
    const queryResult = await db.query(`
      SELECT
        t.transaction_date,
        d.name AS department,
        c.id AS credential_id,
        c.name,
        COALESCE(SUM(td.total_quantity), 0) + COALESCE(SUM(pc.total_quantity), 0) AS total_quantity
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN department d ON u.department = d.id
      JOIN transaction_history th ON t.id = th.transaction_id
      LEFT JOIN (
          SELECT
              td.transaction_id,
              td.credential_id,
              SUM(td.quantity) AS total_quantity
          FROM transaction_details td
          GROUP BY td.transaction_id, td.credential_id
      ) td ON t.id = td.transaction_id
      LEFT JOIN (
          SELECT
              pt.transaction_id,
              pc.credential_id,
              SUM(pc.quantity) AS total_quantity
          FROM package_contents pc
          JOIN package_transactions pt ON pc.package_id = pt.package_id
          GROUP BY pt.transaction_id, pc.credential_id
      ) pc ON t.id = pc.transaction_id
      LEFT JOIN credentials c ON c.id = td.credential_id OR c.id = pc.credential_id
      WHERE th.staff_id = ?
      GROUP BY t.transaction_date, c.id, c.name, d.name
      ORDER BY t.transaction_date ASC, c.name ASC;
    `, [id]);

    const data = queryResult as RowDataPacket[];

    // Organize the data by dates
    const dateData = {}; // Initialize an object to store date-wise data

    data[0].forEach((row) => {
      const date = dayjs(row.transaction_date).format('MM/DD/YYYY');
      const department = row.department;
      const name = row.name;
      const quantity = parseFloat(row.total_quantity);

      if (!dateData[date]) {
        dateData[date] = {};
      }

      if (!dateData[date][department]) {
        dateData[date][department] = [];
      }

      const credentialIndex = dateData[date][department].findIndex(
        (cred) => cred.name === name
      );

      if (credentialIndex === -1) {
        dateData[date][department].push({ name, quantity });
      } else {
        dateData[date][department][credentialIndex].quantity += quantity;
      }
    });

    // Convert the dateData object into the desired format
    const results = Object.entries(dateData).map(([date, departments]) => {
      return {
        date,
        departments: Object.entries(departments).map(([department, credentials]) => {
          return {
            department,
            credentials,
          };
        }),
      };
    });

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
      const data = await fetchStaffCredentialsData(Number(id));

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
