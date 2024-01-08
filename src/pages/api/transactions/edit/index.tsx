import { NextApiResponse, NextApiRequest } from 'next/types'
import db from '../../../db'

interface UpdateData {
  id: number
  user_id: number
  dateFilled: string
  transcriptCopies: number
  dismissalCopies: number
  moralCharacterCopies: number
  diplomaCopies: number
  authenticationCopies: number
  courseDescriptionCopies: number
  certificationType: string
  certificationCopies: number
  cavRedRibbonCopies: number
  totalAmount: number
  purpose: string
  status: string
}

const updateDataById = async (id: number, updatedFields: UpdateData) => {
  const keys = Object.keys(updatedFields)
  const values = keys.map(key => updatedFields[key])

  // Include individual amounts and total amount in the update
  const setArray = [...keys].map(key => `${key} = ?`)
  const updateSet = setArray.join(', ')

  try {
    await db.query(`UPDATE transactions SET ${updateSet} WHERE id = ${id}`, [...values])
  } catch (error) {
    throw error
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, ...formData } = req.body

    // Validate if 'id' is provided
    if (!id) {
      return res.status(400).json({ error: 'Missing ID in request' })
    }
    await updateDataById(id, formData)

    // Send a response to the client
    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
