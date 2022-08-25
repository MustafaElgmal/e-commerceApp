import { productValidation } from './../../../utiles/validations';
import {  getProductes } from './../../../utiles/function'
import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try{
        const products = await getProductes()
        res.json({ products })

      }catch(e){
        res.status(500).json({error:'Server is down!'})

      }
      
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
