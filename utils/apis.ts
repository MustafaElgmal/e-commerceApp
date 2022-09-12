import { OrderCreate } from './../types/index';
import axios from 'axios';
import { Base_Url } from './../constans/index';
import { Dispatch } from 'redux';
import { NextRouter } from 'next/router';
import { resetCart } from 'redux/features/cartSlice';

export const createOrder=async(order:OrderCreate,dispatch:Dispatch,router:NextRouter)=>{
    try{
        const res=await axios.post(`${Base_Url}/api/orders`,order)
        alert('Order is created!')
        dispatch(resetCart())
        router.push('/')
    }catch(e:any){
       if(e.status!==500){
        alert('Order is not created!')
       }else{
        throw e
       }
    }

}