import dotenv from 'dotenv';

dotenv.config();

export function getEndPointForDoctype(doctype){
  const current_path = process.cwd()
  const host = process.env.HOST
  const protocol = process.env.PROTOCOL

  var endpoint
  switch(doctype){
    case 'Client Script':
      endpoint = process.env.CLIENT_SCRIPT_END_POINT
      break
    case 'Server Script':
      endpoint = process.env.SERVER_SCRIPT_END_POINT
      break
    case 'Report':
      endpoint = process.env.REPORT_END_POINT
      break
    default:
      break

  }
  

  const baseUrl = `${protocol}://${host}/api/resource/${endpoint}`
  return baseUrl
  console.log("baseUrl", baseUrl)
}

