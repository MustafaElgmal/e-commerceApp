import { getRecords } from './../../../utils/function'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const products = await getRecords('product')
        res.json({ products: products.product })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
