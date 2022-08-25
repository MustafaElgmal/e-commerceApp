import { categoryValidation } from './../../../utiles/validations'
import { getCategories } from './../../../utiles/function'

import type { NextApiRequest, NextApiResponse } from 'next'
import { uuid } from 'uuidv4'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const errors = await categoryValidation(req.body)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const { name, imageSrc, imageAlt, href } = req.body
        // values: [[id, name, href, imageSrc, imageAlt]],
        const category = await createRecords(,)

        res.status(201).json({ category: category.config.data.values })
      } catch (e) {
        res.status(500).json({ error: 'Api not found' })
      }
      break
    case 'GET':
      try {
        const categories = await getCategories()
        res.json({ categories })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Server is down!' })
  }
}

async function createRecords(values: string[], range: string) {
  const id = uuid()
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILE,
    scopes: process.env.SCOPE,
  })
  const client = await auth.getClient()
  const googlesheets = google.sheets({ version: 'v4', auth: client })
  const spreadsheetId = process.env.SHEETID
  const row = await googlesheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[id,...values]],
    },
  })
  return row
}
