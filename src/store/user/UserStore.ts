import { Wrapper } from '../Wrapper'
import  { 
  UserDocument,
  SavedUser,
  Profile,
  Economy
} from './UserModel'

type SnowflakeEntity = { id: string }

class UserStore extends Wrapper<SnowflakeEntity, UserDocument> {
  async getOrCreate({ id }: SnowflakeEntity) {
    const alreadyExists = await SavedUser.findOne({ _id: id })

    if(alreadyExists)
      return alreadyExists

    const newUser = await this.create({ id })

    await this.save(newUser)

    return newUser
  }

  async create({ id }: SnowflakeEntity) {
    const newUser = new SavedUser({
      _id: id,
      profile: new Profile(),
      economy: new Economy()
    })

    await this.save(newUser)

    return newUser
  }
}

export { UserStore }

