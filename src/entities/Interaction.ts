import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  Interaction as DInteraction,
} from 'discord.js'
import { Piece, PieceContext } from './core/Piece'

interface InteractionOptions {
  readonly name: string
  readonly description: string
  readonly options?: ApplicationCommandOptionData[]
  readonly type?: ApplicationCommandType
}

interface InteractionJSON {
  name: string
  description: string
  options: ApplicationCommandOptionData[]
  type: ApplicationCommandType
}

interface InteractionPayload<T> {
  interaction: T
}

abstract class Interaction extends Piece {
  readonly name: string
  readonly description: string
  readonly options: ApplicationCommandOptionData[]
  readonly type: ApplicationCommandType

  constructor(
    context: PieceContext,
    options: InteractionOptions
  ) {
    super(context)

    this.name = (options.name ?? context.name)
      .toLowerCase()

    this.description = options.description
    this.options = options.options ?? []
    this.type = options.type ?? 1
  }

  abstract execute(payload: InteractionPayload<DInteraction>): unknown

  addOption(option: ApplicationCommandOptionData) {
    this.options.push(option)
  }

  toJSON(): InteractionJSON {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
      type: this.type,
    }
  }
}

export { Interaction, InteractionOptions, InteractionPayload }

