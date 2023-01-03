import { ClientEvents } from 'discord.js'
import { Piece, PieceContext } from './core/Piece'

interface ListenerOptions {
  event: string | symbol
  once?: boolean
}

abstract class Listener<E extends keyof ClientEvents> extends Piece {
  readonly event: string | symbol
  readonly once: boolean

  constructor(
    context: PieceContext,
    options: ListenerOptions
  ) {
    super(context)

    this.event = options.event
    this.once = options.once ?? false
  }

  async onLoad() {
    const container = this.container

    const maxListeners = container.getMaxListeners()
    if (maxListeners !== 0) container.setMaxListeners(maxListeners + 1)

    container[this.once ? 'once' : 'on'](
      this.event as string, this._invoke.bind(this))

    if (this.once)
      await this.unload()

    return super.onLoad()
  }

  async onUnload() {
    const container = this.container

    const maxListeners = container.getMaxListeners()
    if (maxListeners !== 0) container.setMaxListeners(maxListeners - 1)

    container.off(this.event as string, this._invoke)

    return super.onUnload()
  }

  async _invoke(...args: unknown[]): Promise<void> {
    await this.invoke(...args)
  }

  abstract invoke(...args: ClientEvents[E] | unknown[]): unknown
}

declare module 'discord.js' {
  interface ClientEvents {
    [K: string]: unknown[]
  }
} 

export { Listener, ListenerOptions }

