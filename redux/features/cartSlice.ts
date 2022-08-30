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
      const product = state.orders.find(
        (order) => order.id === action.payload.id
      )
      if (
        !product ||
        product.color !== action.payload.color ||
        product.size !== action.payload.size
      ) {
        state.orders = [...state.orders, action.payload]
      } else {
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, quantity: action.payload.quantity }
            : order
        )
      }
      setToStorage('cart', state)
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload.id
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
