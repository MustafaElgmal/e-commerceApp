export interface ProductCreate{
  name: string
  href: string
  price: string
  availableQty: number
  images:{src:string,alt:string}[]
  description:string,
  details:string,
  highlights:string
}
export interface Product extends ProductCreate  {
  id: string
  images:ImageType[]
}
export interface UserCreate{
  firstName:string
  lastName:string
  email:string
  password:string
}
export interface User extends UserCreate{
  id:string
}
export interface errors{
  message:string
}
export interface ImageType{
  id:string,
  src:string,
  alt:string,
  productId:string
}


export interface CartItem extends Product {
  quantity: number
}
export interface CategoryCreate{
  name:string
  imageSrc:string
  imageAlt:string
  href:string
}
export interface Category extends CategoryCreate {
  id:string
}

export type AppStateType = {
  products: Product[]
  categories: Category[]
  cart: CartItem[]
}

export type Page = {
    name: string;
    href: string;
}
export type Navigation = {
  categories: Category[]
}

export interface OrderCreate{
  firstName:string,
  lastName:string,
  address:string
  phoneNumber:string
  orderItems:{productId: string; Qty: number }[]
}
export interface Order extends OrderCreate{
  id:string
}
export interface InfoType{
  firstName:string
  lastName:string
  email:string
  company:string
  address:string
  apartment:string
  city:string
  country:string
  state:string
  postalCode:string
  phone:string
  deliveryMethod:string
  
}