import { connectByGoogleSheet } from './../../sheets/index';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {google, sheets_v4} from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'

type Data = {
  data: GaxiosResponse<sheets_v4.Schema$ValueRange>
}

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const range='Product'
  const metadata=await connectByGoogleSheet(range)

res.send({data:metadata})
}
