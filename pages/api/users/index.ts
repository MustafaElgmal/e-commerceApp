
import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUsers } from 'utiles/function'
import { userVaildation } from 'utiles/validations'
import { uuid } from 'uuidv4'
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const errors = await userVaildation(req.body)

      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }

      try {
       let { firstName, lastName, email, password } = req.body
        const id = uuid()
        const auth = new google.auth.GoogleAuth({
          keyFile: process.env.KEYFILE,
          scopes: process.env.SCOPE,
        })
        const client = await auth.getClient()
        const googlesheets = google.sheets({ version: 'v4', auth: client })
        const spreadsheetId = process.env.SHEETID
        password = await bcrypt.hash(password, 8)
        const user = await googlesheets.spreadsheets.values.append({
          auth,
          spreadsheetId,
          range: 'user!A1:E1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[id, firstName, lastName, email, password]],
          },
        })
        res.status(201).json({ user: user.config.data.values })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    case 'GET':
      try{
        const users = await getUsers()
        res.json({ users })

      }catch(e){
        res.status(500).json({ error: 'Server is down!' })
      }
     
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
