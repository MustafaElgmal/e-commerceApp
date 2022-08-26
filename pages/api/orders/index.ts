import {
  createOrderItems,
  generationCode,
  getRecords,
} from '../../../utils/function'
import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRecord } from 'utils/function'
import { OrderVaildation } from 'utils/validations'
import { uuid } from 'uuidv4'
import sgmail from '@sendgrid/mail'

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
        let { email,firstName, lastName, address, phoneNumber, orderItems } = req.body
        const error = await createOrderItems(orderItems, id)
        if (error.message !== '') {
          return res.status(400).send(error)
        }
        const order = await createRecord(
          [id, firstName, lastName, address, phoneNumber],
          'order!A1:E1'
        )
        sendingConvermationEmail(email,firstName)
        res.json({ message: 'Order is created!' })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    case 'GET':
      try {
        const orders = await getRecords('order')
        res.json({ orders: orders.order })
      } catch (e) {
        res.status(500).json({ error: 'Server is down!' })
      }
      break
    default:
      res.status(500).json({ error: 'Api not found' })
  }
}

const sendingConvermationEmail = (email: string, name: string) => {
  sgmail.setApiKey(process.env.EMAIL_KEY as string)
  const code = generationCode()
  const mail = {
    to: email,
    from: 'reviews6767@gmail.com',
    subject: 'Confirmation',
    text: `Dear,${name}

       ${code} is your Order code.
      
      Thanks,
      The e-commerce website Team`,
  }

  sgmail.send(mail)
}