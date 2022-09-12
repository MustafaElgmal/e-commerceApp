import { ProductWithExtra } from './../../../../types/index';
import { Product, ImageType, ColorType, SizeType } from 'types'
import { getRecords } from './../../../../utils/function'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const {id}=req.query
        if(!id){
            return res.status(400).json({message:'Id is required!'})
        }
        const data = await getRecords(['product', 'productImages','productVariant'])
        let products:ProductWithExtra[]=data.product.filter((product:Product)=>product.categoryId===id)

        products= products.map((product:ProductWithExtra) => {
            const images:ImageType[]  = data.productImages.filter(
              (image: ImageType) => image.productId === product.id
            )
            return { ...product,images}
          })
        

        res.json({products} )
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
