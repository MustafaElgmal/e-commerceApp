import { Product } from 'types'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  convertFromSheetsToJson,
  createImageSrc,
  createRecord,
  getRecords,
} from 'utils/function'
import { productValidation } from 'utils/validations'
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { Id } = req.query
  switch (req.method) {
    case 'POST':
      const errors = await productValidation(req.body, Id as string)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const id = uuid()
        const error=await createImageSrc(req.body.images, id)
        if(error.message!==''){
          return res.status(400).send(error)
        }
        const {
          name,
          href,
          price,
          description,
          details,
          highlights,
          availableQty
        } = req.body
        const product = await createRecord(
          [
            id,
            name,
            href,
            price,
            description,
            details,
            highlights,
            availableQty,
            Id
          ],
          'product!A1:I1'
        )
        res.status(201).json({message:'Product is created!'})
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    case 'GET':
      try {
        const products = await getRecords('product')
        const product = products.product.find(
          (product: Product) => product.id.toString() === Id
        )
        if (!product) {
          return res.status(404).json({ message: 'Product is not found!' })
        }
        res.json({ product })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
