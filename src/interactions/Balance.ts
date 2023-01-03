import { PieceContext } from '../entities/core/Piece'
import { Interaction, InteractionPayload } from '../entities/Interaction'
import {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  User
} from 'discord.js'

export class Balance extends Interaction {
  constructor(context: PieceContext) {
    super(context, {
      name: 'balance',
      description: 'replies with balance',
      options: [
        {
          name: 'target',
          description: 'the target',
          type: ApplicationCommandOptionType.User
        }
      ]
    })
  }

  async execute({ interaction }: InteractionPayload<ChatInputCommandInteraction>) {
    const target = (
      interaction.options.getUser('target') ?? interaction.user) as User

    const container = this.container
    
    const savedUser = await container.userStore
      .getOrCreate(target)

    const economy = savedUser.economy

    const author = {
      name: interaction.user.username as string,
      iconURL: interaction.user.avatarURL() as string
    }

    const first = (target.id === interaction.user.id)
      ? 'You' : target.username
    
    const embed = new EmbedBuilder()
      .setAuthor(author)
      .addFields({
        name: 'Card Limit',
        value: `${first} have **${economy.bank.card.limit}R$** of limit.`,
        inline: true })
      .addFields({
        name: 'Available',
        value: `${first} have **${economy.bank.card.available}R$** available.`,
        inline: true})
      .setDescription(`${first} bank balance is **${economy.bank.balance}R$**`)
      .setColor(0x00ffff)

    await interaction.reply({
      embeds: [embed]
    })
  }
}

