import { OrderCreate } from './../types/index';
import axios from 'axios';
import { Base_Url } from './../constans/index';

export const createOrder=async(order:OrderCreate)=>{
    try{
        const res=await axios.post(`${Base_Url}/api/orders`,order)
        alert('Order is created!')
    }catch(e:any){
       if(e.status!==500){
        alert('Order is not created!')
       }else{
        console.log(e)
       }
    }

}