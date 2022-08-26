import { ImageType, InfoType } from '../types/index';
import { Base_Url } from '../constans/index';
import axios from "axios"
import { convertFromSheetsToJson, getRecords } from './function';

export const getCategories=async(setCollections:Function)=>{
    try{
        const res=await axios.get(`${Base_Url}/api/categories`)
        setCollections(res.data.categories)
    }catch(e){
        console.log(e)
    }

}

export const getProduct=async(setProduct:Function,productId:string)=>{
    try{
        console.log(productId)
        const res=await axios.get(`${Base_Url}/api/products/${productId}`)
        setProduct(res.data.product)
    }catch(e){
        console.log(e)
    }

}


export const getProducts=async(setProducts:Function)=>{
    try{
        const res=await axios.get(`${Base_Url}/api/products`)
        setProducts(res.data.products)
    }catch(e){
        console.log(e)
    }

}
export const postProduct=async(information:InfoType,orderItems:{productId:string,Qty:number})=>{
    try{
        const res=await axios.post(`${Base_Url}/api/orders`,{...information,orderItems})
        alert('Order is created!')
    }catch(e){
        console.log(e)
    }

}
