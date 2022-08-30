import { ProductWithExtra } from './../../../types/index';
import { Product, ImageType, ColorType, SizeType } from 'types'
import { getRecords } from './../../../utils/function'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const data = await getRecords(['product', 'image','color','size'])
        const products:ProductWithExtra[] = data.product.map((product:Product) => {
          const images:ImageType[]  = data.image.filter(
            (image: ImageType) => image.productId === product.id
          )
          const colors:ColorType[] = data.color.filter(
            (color: ColorType) => color.productId === product.id
          )
          let sizes:SizeType[]=[]
           data.size.forEach(
            (size: SizeType) =>{
              if(size.productId===product.id){
               sizes.push({...size,inStock:size.inStock==='TRUE'?true:false})
              }
            }

          )
          return { ...product, images,colors,sizes }
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
