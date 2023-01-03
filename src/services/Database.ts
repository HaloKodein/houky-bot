import mongoose from 'mongoose'

async function bootstrap(uri: string) {
  mongoose.set('strictQuery', false)

  await mongoose.connect(uri)

  console.log('[database -> bootstrap] Connected.')
}

export { bootstrap }

