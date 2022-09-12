import { SubCategory } from '../../../types/index'
import { Category, CategoryCreate } from '../../../types/index'
import { categoryValidation } from '../../../utils/validations'
import {
  convertFromSheetsToJson,
  createRecord,
  getRecords,
} from '../../../utils/function'
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
        const { id } = req.query
        if (!id) {
          res.status(400).json({ message: 'Id is required!' })
        }
        const Id = uuid()
        const { name, imageSrc, imageAlt, href }: CategoryCreate = req.body
        const category = await createRecord(
          [Id, name, href, imageSrc, imageAlt, id as string],
          'subCategory'
        )

        res.status(201).json({ message: 'subCategory is created !' })
      } catch (e) {
        res.status(500).json({ error: 'Api not found' })
      }
      break
    case 'GET':
      try {
        const { id } = req.query
        if (!id) {
          return res.status(400).json({ message: 'Id is required!' })
        }
        const categories: { category: Category[] } =
          await convertFromSheetsToJson(['category'])

        const category = categories.category.find(
          (category: Category) => category.id === id
        )
        if (!category) {
          return res.status(404).json({ message: 'CategorId is not found!' })
        }
        let subcategories = await getRecords(['subCategory'])
        subcategories = subcategories.subcategory.filter(
          (subcategory: SubCategory) => subcategory.categoryId === id
        )
        res.json({ categories: subcategories })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Server is down!' })
  }
}
