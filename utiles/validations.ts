import { convertFromSheetsToJson } from 'utiles/function'
import {
  Category,
  CtaegoryCreate,
  errors,
  ProductCreate,
  User,
  UserCreate,
} from './../types/index'
import validator from 'validator'

export const userVaildation = async (user: UserCreate): Promise<errors[]> => {
  let errors: errors[] = []
  const { firstName, lastName, email, password } = user
  if (!firstName) {
    errors.push({ message: 'FirstName is required!' })
  }
  if (!lastName) {
    errors.push({ message: 'LirstName is required!' })
  }
  if (!email) {
    errors.push({ message: 'Email is required!' })
  } else {
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Email is not vaild!' })
    }
    const users = await convertFromSheetsToJson('user')
    const userFind:User= users.user.find((user: User) => user.email === email)
    if (userFind) {
      errors.push({ message: 'email is already exists!' })
    }
  }
  if (!password) {
    errors.push({ message: 'Password is required!' })
  } else {
    if (!validator.isStrongPassword(password)) {
      errors.push({
        message:
          'Password should be strong ! {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}',
      })
    }
  }
  return errors
}

export const productValidation = async (
  product: ProductCreate,
  categoryId: string
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, href, price, description, availableQty, imageSrc, imageAlt } =
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
  const categories = await convertFromSheetsToJson('category')
  const category:CtaegoryCreate = categories.category.find(
    (category: CtaegoryCreate) => category.id === categoryId
  )
  if (!category) {
    errors.push({ message: 'CategorId is not found!' })
  }

  return errors
}

export const categoryValidation = async (
  category: CtaegoryCreate
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, imageSrc, imageAlt, href } = category
  if (!name) {
    errors.push({ message: 'Name is required!' })
  } else {
    const categories = await convertFromSheetsToJson('category')
    const categoryFind:CtaegoryCreate = categories.category.find(
      (category:CtaegoryCreate) => category.name === name
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
