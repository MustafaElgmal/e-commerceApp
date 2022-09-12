export interface PropsType {
  products?: ProductWithExtra[]
  categories?: Category[]
  product?: ProductWithExtra
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

export interface SubCategory extends Category {
  categoryId: string
}

export interface ProductCreate {
  name: string
  href: string
  price: string
  description: string
  details: string
  highlights: string
}
export interface Product {
  id: string
  name: string
  href: string
  price: string
  description: string
  details: string
  highlights: string
  categoryId: string
  trending: string
}
export interface ProductWithExtra extends Product {
  images: ImageType[]
  variants: {
    id: string
    colorId: string
    sizeId: string
    productId: string
    Qty: string
    color: ColorType
    size: SizeType
  }[]
}
export interface CartItem extends ProductWithExtra {
  quantity: number
  color: string
  size: string
}
export interface ImageCreate {
  imageSrc: string
  imageAlt: string
  productId: string
}
export interface ImageType extends ImageCreate {
  id: string
}
export interface ColorCreate {
  name: string
  bgColor: string
  selectedColor: string
}
export interface ColorType extends ColorCreate {
  id: string
}
export interface SizeCreate {
  name: string
}
export interface SizeType extends SizeCreate {
  id: string
}

export interface variantType {
  id: string
  colorId: string
  sizeId: string
  productId: string
  Qty: string
}

export interface errors {
  message: string
}

export interface CategoryFeatured {
  name: string
  featured: {
    id: string
    name: string
    href: string
    availableQty:string
    price: string
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
