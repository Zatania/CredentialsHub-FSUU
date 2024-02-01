import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'
import dayjs from 'dayjs'

async function fetchUserTransactions(id: number): Promise<any[]> {
  try {
    const queryResult = await db.query(`
      SELECT
        t.transaction_date,
        c.name AS credential_name,
        COALESCE(SUM(td.total_quantity), 0) + COALESCE(SUM(pc.total_quantity), 0) AS total_quantity,
        c.price * (COALESCE(SUM(td.total_quantity), 0) + COALESCE(SUM(pc.total_quantity), 0)) AS total_price
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
      WHERE t.id = ?
      GROUP BY t.transaction_date, c.price, c.name
      ORDER BY t.transaction_date ASC, c.name ASC;
    `, [id]);

    const data = queryResult as RowDataPacket[];
    let total_amount = 0;

    const groupedByDate = data[0].reduce((acc: any, transaction: any) => {
      const formattedDate = dayjs(transaction.transaction_date).format('YYYY-MM-DD');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push({
        name: transaction.credential_name,
        total_quantity: transaction.total_quantity,
        total_price: transaction.total_price
      });

      total_amount += Number(transaction.total_price);

      return acc;
    }, {});

    // Convert the grouped transactions into an array format if needed
    const results = Object.keys(groupedByDate).map((date) => ({
      transaction_date: date,
      total_amount: total_amount,
      credentials: groupedByDate[date],
    }));

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
      const data = await fetchUserTransactions(Number(id));

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
