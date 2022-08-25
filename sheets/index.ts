import { google } from "googleapis"

export const connectByGoogleSheet=async (range:string)=>{

    const auth=new google.auth.GoogleAuth({
        keyFile:process.env.KEYFILE,
        scopes:process.env.SCOPE
    
      })
      try{
        const client=await auth.getClient()
    
        const googlesheets=google.sheets({version:'v4',auth:client})
        const spreadsheetId=process.env.SHEETID
        const metadata=await googlesheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range
        })
        return metadata

      }catch(e){
        console.log(e)
      }
}