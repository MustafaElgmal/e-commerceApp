import { removeFromStorage, setToStorage } from './../../constans/index'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getFromStorage } from 'constans'
import { CartItem } from 'types'

const initialState: { orders: CartItem[] } = getFromStorage('cart')
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const order = state.orders.find(
        (order) =>
          order.id === action.payload.id &&
          order.color === action.payload.color &&
          order.size === action.payload.size
      )
      if (!order) {
        state.orders = [...state.orders, action.payload]
        // if(parseInt(action.payload.availableQty)>=action.payload.quantity){
          
        // }else{
        //   alert('Product out of stock!')
        // }
        
        
      } else {
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id &&
          order.color === action.payload.color &&
          order.size === action.payload.size
            ? { ...order, quantity: action.payload.quantity }
            : order
        )
      }
      setToStorage('cart', state)
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload.id ||
        order.color !== action.payload.color ||
        order.size !== action.payload.size
      )
      setToStorage('cart', state)
    },
    resetCart: (state) => {
      state.orders = []
      removeFromStorage('cart')
    },
  },
})
export const { addToCart, removeFromCart, resetCart } = orderSlice.actions
export default orderSlice.reducer
