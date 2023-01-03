import { config } from 'dotenv'
config()

export default {
  id: '1053723412519981186',
  token: process.env.TOKEN as string,
  client_secret: process.env.CLIENT_SECRET as string,
  mongo_uri: process.env.MONGO_URI as string
}

