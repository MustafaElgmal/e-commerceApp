import { sizeValidation } from './../../../utils/validations';
import { createRecord, getRecords } from '../../../utils/functions'
import type { NextApiRequest, NextApiResponse } from 'next'
import { uuid } from 'uuidv4'
import { Category } from 'types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const errors =sizeValidation(req.body)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const id = uuid()
        const { name}:{name:string} = req.body
        await createRecord(
          [id,name],
          'size',
        )
        res.status(201).json({message:'size is created !'})
      } catch (e) {
        res.status(500).json({ error: 'Api not found' })
      }
      break
    case 'GET':
      try {
        const categories:{category:Category[]} = await getRecords(['category'])
        res.json({ categories: categories.category })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Server is down!' })
  }
}
