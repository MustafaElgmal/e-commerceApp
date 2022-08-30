import { Product } from './../../types/index';
import { removeFromStorage, setToStorage } from './../../constans/index';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFromStorage } from "constans";
import { CartItem } from "types";

const initialState:{products:Product[]}={
    products:[]
}
export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts:(state,action:PayloadAction<Product[]>)=>{
        state.products=action.payload
    }
  }
});
export const {setProducts} = productsSlice.actions;
export default productsSlice.reducer;
