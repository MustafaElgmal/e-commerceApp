import { ProductWithExtra } from 'types';
import { Category, Product } from '../types/index'
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import { extractSheets } from 'spreadsheet-to-json'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import validator from 'validator'
import sgMail from '@sendgrid/mail'

export const convertFromSheetsToJson=(sheetsName: string[]) => {
  const credentials=JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDS!,'base64').toString()
  )
  const data = extractSheets(
    {
      spreadsheetKey: process.env.SHEETID,
      credentials:credentials,
      sheetsToExtract: sheetsName,
    },
    async (err: React.ChangeEvent<HTMLInputElement>, data:any) => {
      if (data) {
        return data
      } else {
        throw err
      }
    }
  )
  return data
}

export const getRecords = async (sheetsName: string[]) => {
  try {
    const rows = await convertFromSheetsToJson(sheetsName)
    return rows
  } catch (e) {
    throw e
  }
}

export const createRecord = async (values: string[], range: string):Promise<GaxiosResponse<sheets_v4.Schema$AppendValuesResponse>> => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.KEYFILE,
      scopes: process.env.SCOPE,
    })
    const client = await auth.getClient()
    const googlesheets = google.sheets({ version: 'v4', auth: client })
    const spreadsheetId = process.env.SHEETID
    const row = await googlesheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[...values]],
      },
    })
    return row
  } catch (error) {
    throw error
  }
}
export const createOrderItems = async (
  orderItems: { productId: string; Qty: number }[],
  orderId: string
): Promise<{ message: string }> => {
  let item: { productId: string; Qty: number }
  const size = orderItems.length
  try {
    const products = await getRecords(['product'])
    for (let i = 0; i < size; i++) {
      item = orderItems[i]
      if (item.Qty === undefined || item.Qty <= 0) {
        return {
          message: 'Product Qty is required and should be positive number!',
        }
      }
      const productFind: Product = await products.product.find(
        (product: Product) => product.id === item.productId
      )
      if (!productFind) {
        return { message: 'Product not found!' }
      }
      const id = uuid()
      await createRecord([id,orderId,item.productId,item.Qty.toString()], 'orderline')
    }
    return { message: '' }
  } catch (e) {
    throw e
  }
}

export const createImageSrc = async (
  images: { imageSrc: string; imageAlt: string }[],
  productId: string
) => {
  try {
    for (let i = 0; i < images.length; i++) {
      if (!validator.isURL(images[i].imageSrc)) {
        return { message: 'image is  not vaild!' }
      }
      const id = uuid()
      await createRecord(
        [id, images[i].imageSrc, images[i].imageAlt, productId],
        'image!A1:D1'
      )
    }
    return { message: '' }
  } catch (e) {
    throw e
  }
}

export const createColors = async (
 colors: { name:string, bgColor:string, selectedColor:string}[]
) => {
  try {
    for (let i = 0; i < colors.length; i++) {
      if(!colors[i].name||!colors[i].bgColor||!colors[i].selectedColor){
        return {message:'Please enter vaild colors!'}
      }
      const id = uuid()
      await createRecord(
        [id, colors[i].name, colors[i].bgColor,colors[i].selectedColor],
        'color!A1:E1'
      )
    }
    return { message: '' }
  } catch (e) {
    throw e
  }
}

export const createSizes = async (
  sizes: { name:string}[]
 ) => {
   try {
     for (let i = 0; i < sizes.length; i++) {
       const id = uuid()
       await createRecord(
         [id, sizes[i].name],
         'size!A1:D1'
       )
     }
     return { message: '' }
   } catch (e) {
     throw e
   }
 }

export const generationCode=():string=>{
  const min=100000
  const max=1000000
  const code=Math.floor(Math.random()*(max-min+1))+min

  return `E-${code}`
}

export const captilize=(name:string)=>{
  const newName=name.split(" ").map((word)=>word[0].toUpperCase()+word.slice(1)).join(" ")
  return newName

}

// export const getAvailableQty=(product:ProductWithExtra)=>{
//   let avaQty=0
//   for(let i=0;i<product.variants.length;i++){
//     avaQty+=parseInt(product.variants[i].Qty)
//   }

//   return Array.from(
//     Array(avaQty),
//     (_, i) => i + 1
//   )
// }