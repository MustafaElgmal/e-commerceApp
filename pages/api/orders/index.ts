import { createOrderItems, getRecords } from '../../../utils/function'
import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRecord } from 'utils/function'
import { OrderVaildation } from 'utils/validations'
import { uuid } from 'uuidv4'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const errors = await OrderVaildation(req.body)
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors })
      }

      try {
        const id = uuid()
        let { firstName, lastName, address, phoneNumber, orderItems } = req.body
        const error=await createOrderItems(orderItems, id)
        if(error.message!==''){
          return res.status(400).send(error)
        }
        console.log("sdlk")
        const order = await createRecord(
          [id, firstName, lastName, address, phoneNumber],
          'order!A1:E1'
        )
        res.json({ message: 'Order is created!' })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    case 'GET':
      try {
        const users = await getRecords('user')
        res.json({ users: users.user })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }

      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}
