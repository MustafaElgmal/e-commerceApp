import { ImageType } from './../types/index';
import { Base_Url } from './../constans/index';
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

// export const getProduct=async(setProduct:Function,productId:string)=>{
//     try{
//         const res=await axios.get(`${Base_Url}/api/products/${productId}`)
//         const images=await getRecords('image')
//         const imagesFilter=images.filter((image:ImageType)=>image.productId===productId)
//         const product={...res.data.product,images:imagesFilter}
//         console.log(product)
//         setProduct(product)
       
//     }catch(e){
//         console.log(e)
//     }

// }