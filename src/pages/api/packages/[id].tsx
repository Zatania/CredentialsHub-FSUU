import { NextApiRequest, NextApiResponse } from 'next/types'
import db from '../../db'
import { RowDataPacket } from 'mysql2'

interface PackageData {
  id: number
  name: string
  description: string
  credentials: CredentialData[]
}

interface CredentialData {
  id: number
  quantity: number
}

async function fetchPackage(id: number) {
  try {
     // Fetch package details
     const [packageDetails] = await db.query('SELECT * FROM packages WHERE id = ?', [id]) as RowDataPacket[]

     if (packageDetails.length === 0) {
       return null; // No package found with the given ID
     }

      // Fetch package contents with credential details
      const [packageContents] = await db.query(`
        SELECT pc.credential_id, pc.quantity, c.name, c.price
        FROM package_contents pc
        JOIN credentials c ON pc.credential_id = c.id
        WHERE pc.package_id = ?
      `, [id]) as RowDataPacket[]

      // Format the response
      const formattedPackage = {
        id: packageDetails[0].id,
        name: packageDetails[0].name,
        description: packageDetails[0].description,
        credentials: packageContents.map((content: { credential_id: any; quantity: any; name: any; price: any }) => ({
          id: content.credential_id,
          quantity: content.quantity,
          name: content.name,
          price: content.price
        }))
      }

      return formattedPackage
  } catch(error) {
    throw error
  }
}

async function updatePackage(id: number, data: PackageData) {
  try {
    // Update package details
    await db.query('UPDATE packages SET name = ?, description = ? WHERE id = ?', [data.name, data.description, id]);

    // Remove existing credentials from package_contents
    await db.query('DELETE FROM package_contents WHERE package_id = ?', [id]);

    // Insert updated credentials into package_contents
    for (const credential of data.credentials) {
      await db.query('INSERT INTO package_contents (package_id, credential_id, quantity) VALUES (?, ?, ?)', [id, credential.id, credential.quantity]);
    }

    return 'success';
  } catch (error) {
    throw error;
  }
}

async function deletePackage(id: number) {
  try {
    await db.query(`DELETE FROM package_contents WHERE package_id = ?`, [id])

    await db.query(`DELETE FROM packages WHERE id = ?`, [id])

    return 'success'
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
      await updatePackage(Number(id), data)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await deletePackage(Number(id))
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } if (req.method === 'GET') {
    try {
      const packageData = await fetchPackage(Number(id))
      console.log(packageData)
      res.status(200).json(packageData)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
