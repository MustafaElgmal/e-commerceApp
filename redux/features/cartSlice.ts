
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "types";


const initialState:{orders:CartItem[]} ={
    orders:[]
}
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToCart:(state,action:PayloadAction<CartItem>)=>{
        state.orders=[...state.orders,action.payload]
    },
    removeFromCart:(state,action:PayloadAction<CartItem>)=>{
        state.orders=state.orders.filter((order)=>order.id!==action.payload.id)
    },
  }
});
export const {addToCart,removeFromCart} = orderSlice.actions;
export default orderSlice.reducer;
