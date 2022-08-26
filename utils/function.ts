import { Category, Product, User, UserCreate } from '../types/index'
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import { extractSheets } from 'spreadsheet-to-json'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import validator from 'validator'
import sgMail from '@sendgrid/mail'

export const convertFromSheetsToJson = (sheetName: string) => {
  const data = extractSheets(
    {
      spreadsheetKey: process.env.SHEETID,
      credentials: require('../credentials.json'),
      sheetsToExtract: [`${sheetName}`],
    },
    async (err: React.ChangeEvent<HTMLInputElement>, data: any) => {
      if (data) {
        return data
      } else {
        throw err
      }
    }
  )
  return data
}

export const getRecords = async (sheetName: string) => {
  try {
    const rows = await convertFromSheetsToJson(sheetName)
    return rows
  } catch (e) {
    throw e
  }
}

export const createRecord = async (values: string[], range: string) => {
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
    const products = await getRecords('product')
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
      await createRecord([id, productFind.id, orderId], 'orderItem!A1:C1')
    }
    return { message: '' }
  } catch (e) {
    throw e
  }
}

export const createImageSrc = async (
  images: { src: string; alt: string }[],
  productId: string
) => {
  try {
    for (let i = 0; i < images.length; i++) {
      if (!validator.isURL(images[i].src)) {
        return { message: 'image is  not vaild!' }
      }
      const id = uuid()
      await createRecord(
        [id, images[i].src, images[i].alt, productId],
        'image!A1:D1'
      )
    }
    return { message: '' }
  } catch (e) {
    throw e
  }
}

export const generationCode=()=>{
  const min=100000
  const max=1000000
  const code=Math.floor(Math.random()*(max-min+1))+min

  return `E-${code}`
}
