export interface ProductCreate{
  name: string
  href: string
  price: number
  availableQty: number
  imageSrc: string
  imageAlt: string
  description:string

}
export interface Product extends ProductCreate  {
  id: string
 color:string
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


export interface CartItem extends Product {
  quantity: number
}
export interface CtaegoryCreate{
  id?:string
  name:string
  imageSrc:string
  imageAlt:string
  href:string
}
export type Category = {
  name: string
  featured: Product[]
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