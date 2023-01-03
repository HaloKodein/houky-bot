import {
  Client as _Client,
  ClientOptions,
  GatewayIntentBits,
  CommandInteraction,
  GuildMember,
  Guild
} from 'discord.js'
import { resolve } from 'path'
import {
  InteractionLoader
} from '../loaders/InteractionLoader'
import {
  ListenerLoader
} from '../loaders/ListenerLoader'
import { UserStore } from '../store/user/UserStore'
import { SavedUser } from '../store/user/UserModel'

const defaultClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
}

class Client extends _Client {
  readonly interactionLoader: InteractionLoader
  readonly listenerLoader: ListenerLoader
  readonly userStore: UserStore

  constructor(options: ClientOptions = defaultClientOptions) {
    super(options)

    this.interactionLoader = new InteractionLoader()
    this.listenerLoader = new ListenerLoader()
    this.userStore = new UserStore()
  }

  async login(token: string) {
    await this.interactionLoader
      .registryPath(resolve(__dirname, '..', 'interactions'))
      .loadAll()

    await this.listenerLoader
      .registryPath(resolve(__dirname, '..', 'listeners' ))
      .loadAll()

    //@ts-ignore
    this.on('interactionCreate', async(interaction: CommandInteraction) => {
      await userAddNormalize(interaction.member as GuildMember)
    })

    //@ts-ignore
    this.on('GuildMemberRemove', userRemoveNormalize)

    const login = await super.login(token)

    return login
  }
}

async function userAddNormalize(member: GuildMember) {
  const store = new UserStore()

  const alreadyExists = await SavedUser
    .findOne({ _id: member.id })

  if (alreadyExists)
    return

  await store.create(member)

  console.log(
    `[database -> normalize] User ${member.user.username} Created.`)
}

async function userRemoveNormalize(member: GuildMember) {
  await SavedUser.findOneAndDelete({ _id: member.id })

  console.log(
    `[dabatase -> normalize] User ${member.user.username} Deleted.`)
}

export { Client }

