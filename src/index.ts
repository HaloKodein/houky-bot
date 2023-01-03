import { Client } from './client/'
import { bootstrap } from './services/Database'
import config from './config'

const client = new Client()

;(async () => {
  const mongo_uri = config.mongo_uri as string
  const token = config.token as string

  try {
    await bootstrap(mongo_uri)

    await client.login(token)
  } catch(err) {
    console.error(err)
  }
})()

export { client }

