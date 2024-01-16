import { NextApiHandler, NextApiRequest } from 'next/types'
import formidable from "formidable"
import path from "path"
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false,
  },
}

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {}
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/uploads")
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename
    }
  }
  options.maxFileSize = 4000 * 1024 * 1024
  const form = formidable(options)

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/uploads"))
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"))
  }

  try {
    const file = await readFile(req, true)
    const myImage = file.files.myImage;
    if (myImage instanceof Array && myImage.length > 0) {
      const fullPath = myImage[0].filepath;
      const relativePath = path.relative(path.join(process.cwd(), "public/uploads"), fullPath);

      res.json({ imagePath: relativePath.replace(/\\/g, '/') });
    }
  } catch (error) {
    console.log(error)
    console.error(error)
  }
}

export default handler
