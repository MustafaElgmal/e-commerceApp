export interface PropsType {
  products?: ProductWithExtra[]
  categories?: Category[]
  product?: ProductWithExtra
}
export interface ProductCreate {
  name: string
  href: string
  price: string
  availableQty: string
  images: { src: string; alt: string }[]
  colors: {
    name: string
    bgColor: string
    selectedColor: string
  }[]
  sizes: {
    name: string
    inStock: boolean
  }[]
  
  description: string
  details: string
  highlights: string
}
export interface Product {
  id: string
  name: string
  href: string
  price: string
  availableQty: string
  description: string
  details: string
  highlights: string,
  categoryId:string
}
export interface ProductWithExtra extends Product{
  images: ImageType[]
  colors:ColorType[]
  sizes:SizeType[]
}
export interface CartItem extends ProductWithExtra {
  quantity: number,
  color:string,
  size:string
}
export interface ImageType {
  id: string
  src: string
  alt: string
  productId: string
}
export interface ColorType {
  id:string
  name: string
  bgColor: string
  selectedColor: string
  productId:string
}
export interface SizeType {
  id:string
  name: string
  inStock: string|boolean
  productId:string
}


export interface UserCreate {
  firstName: string
  lastName: string
  email: string
  password: string
}
export interface User extends UserCreate {
  id: string
}
export interface errors {
  message: string
}

export interface CategoryCreate {
  name: string
  imageSrc: string
  imageAlt: string
  href: string
}
export interface Category extends CategoryCreate {
  id: string
}
export interface CategoryFeatured {
  name: string
  featured: {
    id: string
    name: string
    href: string
    price: string
    availableQty: string
    imageAlt: string
    imageSrc: string
  }[]
}

export type AppStateType = {
  products: Product[]
  categories: Category[]
  cart: CartItem[]
}

export type Page = {
  name: string
  href: string
}
export type Navigation = {
  categories: CategoryFeatured[]
}

export interface OrderCreate extends InfoType {
  orderItems: { productId: string; Qty: number }[]
}
export interface Order extends OrderCreate {
  id: string
}
export interface InfoType {
  firstName: string
  lastName: string
  email: string
  company: string
  address: string
  apartment: string
  city: string
  country: string
  state: string
  postalCode: string
  phoneNumber: string
  deliveryMethod: string
}
