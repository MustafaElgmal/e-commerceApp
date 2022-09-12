import { ImageCreate } from './../../../types/index';
import { colorValidation, sizeValidation, imageValidation } from './../../../utils/validations';
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
      const errors =imageValidation(req.body)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const {id}=req.query
       
        if(!id){
            return res.status(400).json({message:'Id is required!'})
        }
        const Id = uuid()
        const { imageSrc,imageAlt}:ImageCreate = req.body
        await createRecord(
          [Id,imageSrc,imageAlt,id as string],
          'productImages',
        )
        res.status(201).json({message:'image is created !'})
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
