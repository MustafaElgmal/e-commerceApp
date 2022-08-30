import { configureStore } from "@reduxjs/toolkit";
import cartSlice from '../features/cartSlice'
import productSlice from '../features/productsSlice'
export const store = configureStore({
  reducer: {
    cart:cartSlice,
    product:productSlice
   
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
