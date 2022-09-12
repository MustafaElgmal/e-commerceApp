import { ColorCreate, ImageCreate, OrderCreate, SizeCreate } from './../types/index'
import {
  convertFromSheetsToJson,
  createImageSrc,
  getRecords,
} from 'utils/functions'
import {
  Category,
  CategoryCreate,
  errors,
  ProductCreate,
} from '../types/index'
import validator from 'validator'

export const categoryValidation = async (
  category: CategoryCreate
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, imageSrc, imageAlt, href } = category
  if (!name) {
    errors.push({ message: 'Name is required!' })
  } else {
    const categories:{category:Category[]} = await convertFromSheetsToJson(['category'])
    const categoryFind = categories.category.find(
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
    errors.push({ message: 'imageAlt is required!' })
  }

  return errors
}


export const productValidation = async (
  product: ProductCreate,
  categoryId: string
): Promise<errors[]> => {
  let errors: errors[] = []
  const { name, href, price, description,details,highlights} =
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
  if(!highlights){
    errors.push({ message: ' highlights is required!' })

  }
  if(!details){
    errors.push({ message: ' details is required!' })

  }
  const categories:{category:Category[]} = await convertFromSheetsToJson(['category'])

  const category= categories.category.find(
    (category: Category) => category.id === categoryId
  )
  if (!category) {
    errors.push({ message: 'CategorId is not found!' })
  }
  return errors
}



export const OrderVaildation = async (
  order: OrderCreate
): Promise<errors[]> => {
  let errors: errors[] = []
  const { firstName, lastName,email,phoneNumber,company, address,apartment,city,country,state,postalCode,deliveryMethod} = order
  if (!firstName) {
    errors.push({ message: 'FirstName is required!' })
  }
  if (!lastName) {
    errors.push({ message: 'LirstName is required!' })
  }
  if (!email) {
    errors.push({ message: 'email is required!' })
  }else{
    if(! validator.isEmail(email)){
      errors.push({message:'Email is not vaild!'})
    }
  }
  if (!phoneNumber) {
    errors.push({ message: 'phoneNumber is required!' })
  }
  if (!company) {
    errors.push({ message: 'company is required!' })
  }

  if (!address) {
    errors.push({ message: 'address is required!' })
  }
  if (!apartment) {
    errors.push({ message: 'apartment is required!' })
  }
  if (!city) {
    errors.push({ message: 'city is required!' })
  }
  if (!country) {
    errors.push({ message: 'country is required!' })
  }
  if (!state) {
    errors.push({ message: 'state is required!' })
  }
  if (!postalCode) {
    errors.push({ message: 'postalCode is required!' })
  }
  if (!deliveryMethod) {
    errors.push({ message: 'deliveryMethod is required!' })
  }
  if (order.orderItems===undefined||order.orderItems.length === 0) {
    errors.push({ message: 'OrderItems is required!' })
  }
  return errors
}

export const colorValidation=(color:ColorCreate):errors[]=>{
  const errors:errors[]=[]
  const {name,bgColor,selectedColor}=color
  if(!name){
    errors.push({message:'Name is required!'})
  }
  if(!bgColor){
    errors.push({message:'bgColor is required!'})
  }
  if(!selectedColor){
    errors.push({message:'selectedColor is required!'})
  }
  return errors
}

export const sizeValidation=(size:SizeCreate):errors[]=>{
  const errors:errors[]=[]
  const {name}=size
  if(!name){
    errors.push({message:'Name is required!'})
  }
  return errors
}

export const imageValidation=(image:ImageCreate):errors[]=>{
  const errors:errors[]=[]
  const {imageSrc,imageAlt}=image
  if(!imageSrc){
    errors.push({message:'imageSrc is required!'})
  }
  if(!imageAlt){
    errors.push({message:'imageAlt is required!'})
  }
  return errors
}
