import { Listener } from '../entities/Listener'
import { PieceContext } from '../entities/core/Piece'
import { Events, REST, Routes } from 'discord.js'
import config from '../config'

export class Ready extends Listener<typeof Events.ClientReady> {
  constructor(context: PieceContext) {
    super(context, {
      event: Events.ClientReady
    })
  }

  async invoke() {
    const pieces = this
      .container
      .interactionLoader
      .entries()

    const interactions = []

    const rest = new REST({ version: '10' })
      .setToken(config.token as string)

    for (const [_, piece] of pieces) {
      interactions.push(piece.toJSON())
    }

    try {
      await rest.put(
        Routes.applicationCommands(config.id),
        { body: interactions })

      console.log(
        `[interactions -> normalize] Loading ${interactions.length} interactions.`)
    } catch(err) {
      console.error(err)
    }

    console.log(`Tudo pronto!`)
  }
}

