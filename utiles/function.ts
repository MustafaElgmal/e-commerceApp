import { userVaildation } from './validations'
import { Category, Product, User, UserCreate } from './../types/index'
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import { extractSheets } from 'spreadsheet-to-json'
import bcrypt from 'bcrypt'

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
      }
    }
  )
  return data
}

export const getCategories = async (): Promise<Category[]> => {
  const categories = await convertFromSheetsToJson('category')
  return categories.category
}
export const getProductes = async (): Promise<Product[]> => {
  const products = await convertFromSheetsToJson('product')
  return products.product
}
export const getUsers = async (): Promise<User[]> => {
  const users = await convertFromSheetsToJson('user')
  return users.user
}

