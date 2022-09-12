import { colorValidation } from './../../../utils/validations';
import { categoryValidation } from '../../../utils/validations'
import { createRecord, getRecords } from '../../../utils/function'
import type { NextApiRequest, NextApiResponse } from 'next'
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const errors =colorValidation(req.body)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const id = uuid()
        const { name,bgColor,selectedColor} = req.body
       await createRecord(
          [id,name, bgColor ,selectedColor],
          'color',
        )
        res.status(201).json({message:'color is created !'})
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
