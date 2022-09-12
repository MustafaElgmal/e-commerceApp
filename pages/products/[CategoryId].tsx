import axios from "axios"
import Layout from "components/layout"
import { Base_Url } from "constans"
import { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import {ProductWithExtra, PropsType } from "types"


export const getStaticPaths:GetStaticPaths = async () => {
  
  const res = await axios.get(`${Base_Url}/api/products`)
  const products: ProductWithExtra[] = res.data.products
  const paths = products.map((product:ProductWithExtra) => {
    return {
      params: { CategoryId: product.categoryId },
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps:GetStaticProps=async(context:any)=>{
  let products:ProductWithExtra[]=[]
  try{
    const res=await axios.get(`${Base_Url}/api/products/category/${context.params.CategoryId}`)
     products=res.data.products

  }catch(e){
    console.log(e)
  }
  return{
    props:{
      products
    }
  }
}

  
  export default function Example({products}:PropsType) {
    return (
      <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
  
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
              <a>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                  <img
                    src={product.images[0].imageSrc}
                    alt={product.images[0].imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                  <h3>{product.name}</h3>
                  <p>{`$${product.price}`}</p>
                </div>
              </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </Layout>
    )
  }