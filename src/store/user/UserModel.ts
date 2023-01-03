import { model, Schema, Document } from 'mongoose'

interface UserDocument extends Document {
  _id: string
  profile: Profile
  economy: Economy
}

class Profile {
  description: string
  background: string
  badges: string[]

  constructor() {
    this.description = 'This is my default description!'
    this.background = 'default'
    this.badges = []
  }
}

class Economy {
  xp: number
  level: number
  bank: Bank

  constructor() {
    this.xp = 0
    this.level = 0
    this.bank = new Bank()
  }
}

class Bank {
  name: string
  card: Card
  balance: number

  constructor() {
    this.name = 'Houky\'s'
    this.card = new Card()
    this.balance = 1000
  }
}

class Card {
  limit: number
  available: number

  constructor() {
    this.limit = 2000
    this.available = 2000
  }
}

const UserSchema = new Schema({
  _id: String,
  profile: { type: Object, default: new Profile() },
  economy: { type: Object, default: new Economy() }
},
{
  timestamps: true
})

const SavedUser = model<UserDocument>('User', UserSchema)

export { UserDocument, SavedUser, Profile, Economy }

