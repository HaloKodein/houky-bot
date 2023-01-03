import { PieceContext } from '../entities/core/Piece'
import { Interaction, InteractionPayload } from '../entities/Interaction'
import { ChatInputCommandInteraction } from 'discord.js'

export class Ping extends Interaction {
  constructor(context: PieceContext) {
    super(context, {
      name: 'ping',
      description: 'replies with ping'
    })
  }

  async execute({ interaction }: InteractionPayload<ChatInputCommandInteraction>) {
    await interaction.reply({
      content: 'Pong!',
      ephemeral: true
    })
  }
}

