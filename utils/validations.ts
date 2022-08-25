import { OrderCreate } from './../types/index'
import {
  convertFromSheetsToJson,
  createImageSrc,
  getRecords,
} from 'utils/function'
import {
  Category,
  CategoryCreate,
  errors,
  ProductCreate,
  User,
  UserCreate,
} from '../types/index'
import validator from 'validator'

export const OrderVaildation = async (
  order: OrderCreate
): Promise<errors[]> => {
  let errors: errors[] = []
  const { firstName, lastName, address, phoneNumber,orderItems } = order
  if (!firstName) {
    errors.push({ message: 'FirstName is required!' })
  }
  if (!lastName) {
    errors.push({ message: 'LirstName is required!' })
  }
  if (!address) {
    errors.push({ message: 'address is required!' })
  }
  if (!phoneNumber) {
    errors.push({ message: 'phoneNumber is required!' })
  }
  if (orderItems===undefined||orderItems.length === 0) {
    errors.push({ message: 'OrderItems is required!' })
  }
  return errors
}

export const productValidation = async (
  product: ProductCreate,
  categoryId: string
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, href, price, description, availableQty,details,highlights,images} =
    product
  if (!name) {
    errors.push({ message: 'Name is required!' })
  }
  if (!href) {
    errors.push({ message: 'Href is required!' })
  }
  if (!price) {
    errors.push({ message: 'price is required!' })
  }
  if (!description) {
    errors.push({ message: 'Description is required!' })
  }
  if (!availableQty) {
    errors.push({ message: 'availableQty is required!' })
  }
  if(!highlights){
    errors.push({ message: ' highlights is required!' })

  }
  if(!details){
    errors.push({ message: ' details is required!' })

  }
  const categories = await convertFromSheetsToJson('category')
  const category: CategoryCreate = categories.category.find(
    (category: Category) => category.id === categoryId
  )
  if (!category) {
    errors.push({ message: 'CategorId is not found!' })
  }
  if(images.length===0){
    errors.push({ message: 'Images is not found!' })
  }
  return errors
}

export const categoryValidation = async (
  category: CategoryCreate
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, imageSrc, imageAlt, href } = category
  if (!name) {
    errors.push({ message: 'Name is required!' })
  } else {
    const categories = await convertFromSheetsToJson('category')
    const categoryFind: CategoryCreate = categories.category.find(
      (category: CategoryCreate) => category.name === name
    )
    if (categoryFind) {
      errors.push({ message: 'category is already exists!' })
    }
  }

  if (!href) {
    errors.push({ message: 'Href is required!' })
  }
  if (!imageSrc) {
    errors.push({ message: 'imageSrc is required!' })
  } else {
    if (!validator.isURL(imageSrc)) {
      errors.push({ message: 'imageSrc is  not vaild!' })
    }
  }
  if (!imageAlt) {
    errors.push({ message: 'Name is required!' })
  }

  return errors
}
