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

async function fetchPackages() {
  const packages = (await db.query('SELECT * FROM packages WHERE is_deleted = FALSE ORDER BY name')) as RowDataPacket

  const packagesRows = packages[0].map((row: PackageData) => ({
    package_id: row.id,
    package_name: row.name,
    package_description: row.description
  }))

  return packagesRows
}

async function addPackage(data: PackageData) {
  try {
    const [packageData] = (await db.query(`INSERT INTO packages (name, description) VALUES (?, ?)`, [data.name, data.description])) as RowDataPacket[]
    const packageId = packageData.insertId

    data.credentials.forEach(async (credential) => {
      await db.query('INSERT INTO package_contents (package_id, credential_id, quantity) VALUES (?, ?, ?)', [packageId, credential.id, credential.quantity])
    })

    return 'success'
  } catch(error) {
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const packageData = await fetchPackages()
      res.status(200).json(packageData)
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else if (req.method === 'POST') {
    try {
      await addPackage(req.body)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
