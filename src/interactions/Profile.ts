import { PieceContext } from '../entities/core/Piece'
import { Interaction, InteractionPayload } from '../entities/Interaction'
import {
  ChatInputCommandInteraction
} from 'discord.js'

import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

import { Image } from 'imagescript'

export class Profile extends Interaction {
  constructor(context: PieceContext) {
    super(context, {
      name: 'profile',
      description: 'replies with profile'
    })
  }

  private file_path = join(__dirname, 'profile.png')

  async execute({ interaction }: InteractionPayload<ChatInputCommandInteraction>) {
    const image = new Image(600, 600)
    image.fill(0x00ffff)

    const encoded = await image.encode(1)

    await writeFile(this.file_path, encoded)

    await interaction.followUp({
      files: [this.file_path]
    })

    await unlink(this.file_path)
  }
}

