import { Product } from 'types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import { connectByGoogleSheet } from 'sheets'
import { convertFromSheetsToJson } from 'utiles/function'
import { productValidation } from 'utiles/validations'
import { uuid } from 'uuidv4'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { Id } = req.query
  switch(req.method){
    case 'POST':
      const errors=await productValidation(req.body,Id as string)
      if(errors.length>0){
          return res.status(400).json({messages:errors})
      }
      try{
          const {name,href,price,description,availableQty,imageSrc,imageAlt}=req.body
          const id=uuid()
          const auth=new google.auth.GoogleAuth({
              keyFile:process.env.KEYFILE,
              scopes:process.env.SCOPE
          
            })
            const client=await auth.getClient()
            const googlesheets=google.sheets({version:'v4',auth:client})
            const spreadsheetId=process.env.SHEETID
            const product=await googlesheets.spreadsheets.values.append({
              auth,
              spreadsheetId,
              range:'product!A1:I1',
              valueInputOption:'USER_ENTERED',
              requestBody:{
                  values:[
                      [id,name,href,price,description,availableQty,imageSrc,imageAlt,Id]
                  ]
              },
            })
            res.status(201).json({product:product.config.data.values})
            
      }catch(e){
          res.status(500).json({error:'Server is down!'})
      }

      break
      case 'GET':
        try{
          const products = await convertFromSheetsToJson('product')
          const product = products.product.find((product: Product) => product.id.toString() === Id)
          if(!product){
            return res.status(404).json({message:'Product is not found!'})
          }
          res.json({ product })
      
        }catch(e){
          res.status(500).json({error:'Server is down!'})
        }
        break
        default:
          res.status(500).json({ error: 'Api not found' })

  }
 
 
}
