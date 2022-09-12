import { ProductCreate } from './../../../types/index';
import { ColorType, SizeType, variantType } from '../../../types/index'
import { createColors, createSizes } from '../../../utils/functions'
import { ImageType, Product } from 'types'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  convertFromSheetsToJson,
  createImageSrc,
  createRecord,
  getRecords,
} from 'utils/functions'
import { productValidation } from 'utils/validations'
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  switch (req.method) {
    case 'POST':
      const errors = await productValidation(req.body, id as string)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }
      try {
        const Id = uuid()
        const { name, href, price, description, details, highlights,trending }:ProductCreate = req.body
        await createRecord(
          [Id, name, href, price, description, details, highlights,trending.toString(),id as string],
          'product'
        )
        res.status(201).json({ message: 'Product is created!' })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    case 'GET':
      try {
        const data = (await getRecords([
          'product',
          'productImages',
          'productVariant',
          'color',
          'size',
        ])) as {
          product: Product[]
          productImages: ImageType[]
          productVariant: variantType[]
          color: ColorType[]
          size: SizeType[]
        }

        const product = data.product.find(
          (product) => product.id.toString() === id
        )
        if (!product) {
          return res.status(404).json({ message: 'Product is not found!' })
        }
        const images = data.productImages.filter(
          (image) => image.productId === product.id
        )
        const productVariants = data.productVariant
          .filter((variant) => variant.productId === id)
          .map((variant) => ({
            ...variant,
            color: data.color.find((color) => color.id === variant.colorId),
            size: data.size.find((size) => size.id === variant.sizeId),
          }))
        res.json({ product: { ...product,images, variants: productVariants } })
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
