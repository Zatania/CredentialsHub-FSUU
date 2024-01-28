import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function fetchData(): Promise<any[]> {
  const data = (await db.query(`
    SELECT
      t.transaction_date,
      c.id AS credential_id,
      c.name,
      COALESCE(SUM(td.total_quantity), 0) + COALESCE(SUM(pc.total_quantity), 0) AS total_quantity
    FROM transactions t
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
    GROUP BY t.transaction_date, c.id, c.name
    ORDER BY t.transaction_date ASC, c.name ASC;
  `)) as RowDataPacket[];

  // Organize the data by dates
  const aggregatedData: any = {};

  data[0].forEach((row: any) => {
    const date = dayjs(row.transaction_date).format('MMMM DD, YYYY');
    const name = row.name;
    const quantity = parseFloat(row.total_quantity); // Convert string to number

    if (!aggregatedData[date]) {
      aggregatedData[date] = {};
    }

    if (!aggregatedData[date][name]) {
      aggregatedData[date][name] = 0;
    }

    aggregatedData[date][name] += quantity;
  });

  // Convert the aggregated data into an array format suitable for response
  const results = Object.entries(aggregatedData).map(([date, credentials]) => {
    return {
      date,
      ...credentials
    };
  });

  return results;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const data = await fetchData();

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
