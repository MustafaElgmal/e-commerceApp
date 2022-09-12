import { categoryValidation } from '../../../utils/validations'
import { createRecord, getRecords } from '../../../utils/functions'
import type { NextApiRequest, NextApiResponse } from 'next'
import { uuid } from 'uuidv4'

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
        const id = uuid()
        const { name, imageSrc, imageAlt, href } = req.body
        const category = await createRecord(
          [id,name, href, imageSrc, imageAlt],
          'category!A1:E1',
          
        )

        res.status(201).json({message:'Category is created !'})
      } catch (e) {
        res.status(500).json({ error: 'Api not found' })
      }
      break
    case 'GET':
      try {
        const categories = await getRecords(['category'])
        res.json({ categories: categories.category })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Server is down!' })
  }
}
