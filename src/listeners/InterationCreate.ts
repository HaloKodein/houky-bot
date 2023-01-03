import { Listener } from '../entities/Listener'
import { PieceContext } from '../entities/core/Piece'
import { Events, Interaction, CommandInteraction } from 'discord.js'

type Event = typeof Events.InteractionCreate

export class InteractionCreate extends Listener<Event> {
  constructor(context: PieceContext) {
    super(context, {
      event: Events.InteractionCreate
    })
  }

  async invoke(interaction: Interaction & CommandInteraction) {
    const container = this.container

    if (!interaction.isChatInputCommand()) return

    await interaction.deferReply()

    const command = container.interactionLoader
      .get(interaction.commandName)

    if (!command) return

    try {
      await command.execute({ interaction })
    } catch (err) {
      console.error(err)
    }
  }
}

