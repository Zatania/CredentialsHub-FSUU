import { NextApiResponse, NextApiRequest } from 'next/types'
import db from '../../../db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id }
  } = req

  try {
    const transactionDetails = await db.query('SELECT * FROM transactions WHERE id = ?', [id])

    if (!transactionDetails) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.status(200).json(transactionDetails[0])
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
