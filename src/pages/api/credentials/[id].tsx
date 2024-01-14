import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'

// Mock functions, replace with actual database logic
async function updateCredential(id: number, data: any) {
  try {
    const [rows] = await db.query(`UPDATE credentials SET name = ?, price = ? WHERE id = ?`, [data.name, data.price, id])

    return rows
  } catch(error) {
    throw error
  }
}

async function deleteCredential(id: number) {
  try {
    // Check if the credential is in use
    const [transactions] = await db.query(`SELECT * FROM package_contents WHERE credential_id = ?`, [id]) as RowDataPacket[]
    if (transactions.length > 0) {
      throw new Error('Credential is in use in a package and cannot be deleted.')
    }

    // Check if the credential is in the another_table
    const [transactions2] = await db.query(`SELECT * FROM transaction_details WHERE credential_id = ?`, [id]) as RowDataPacket[]
    if (transactions2.length > 0) {
      throw new Error('Credential is in use in a transaction and cannote be deleted.')
    }

    const [rows] = await db.query(`DELETE FROM credentials WHERE id = ?`, [id])

    return rows
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
      await updateCredential(Number(id), data)
      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteCredential(Number(id))
      res.status(204).end()
    } catch (error) {
      console.error(error)
      const errorMessage = error.message || 'Internal Server Error'
      res.status(500).json({ message: errorMessage })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
