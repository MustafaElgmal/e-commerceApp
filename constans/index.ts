import { CartItem } from './../types/index'
export const Base_Url = 'http://localhost:3000'


export const getFromStorage = (key: string):{orders:CartItem[]} => {
  if (typeof window !== 'undefined') {
    const local=window.localStorage.getItem(key)
    return local===null?{orders:[]}: JSON.parse(local)
  }
  return {orders:[]}
}

export const setToStorage = (key: string, value: {orders:CartItem[]}) => {
  if (typeof window !== 'undefined') {
     window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const removeFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
       window.localStorage.removeItem(key)
    }
  }

