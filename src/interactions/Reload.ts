import { PieceContext } from '../entities/core/Piece'
import { Interaction, InteractionPayload } from '../entities/Interaction'
import {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType
} from 'discord.js'

export class Reload extends Interaction {
  constructor(context: PieceContext) {
    super(context, {
      name: 'reload',
      description: 'reload the interaction.',
      options: [
        {
          name: 'name',
          description: 'interaction name to reload',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    })
  }

  async execute({ interaction }: InteractionPayload<ChatInputCommandInteraction>) {
    const name = interaction.options.getString('name') as string

    if (!this.loader.get(name))
      return await interaction.followUp({
        content: `The interaction ${name} not exists.`,
        ephemeral: true
      })

    await interaction.followUp({
      content: `The interaction ${name} id reloaded!`,
      ephemeral: true
    })

    await this.loader.reload(name)
  }
}

