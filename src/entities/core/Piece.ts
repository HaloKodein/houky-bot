import { PieceLoader } from '../../services/PieceLoader'
import { Client } from '../../client'
import { client } from '../../'
import { join } from 'path'

interface PieceContext {
  name: string
  enabled?: boolean
  loader: PieceLoader<Piece>
  path: string
  root: string
}

class Location {
  path: string
  root: string

  constructor(path: string, root: string) {
    this.path = path
    this.root = root
  }
}

class Piece {
  readonly location: Location
  readonly loader: PieceLoader<Piece>
  readonly name: string
  enabled: boolean
  container: Client

  constructor(ctx: PieceContext) {
    this.location = new Location(ctx.path, ctx.root)
    this.loader = ctx.loader
    this.enabled = ctx.enabled ?? true
    this.name = ctx.name
    this.container = client
  }

  async unload() {
    await this.loader.unload(this.name)
    this.enabled = false
  }

  async reload() {
    const path = join(
      this.location.root,
      this.location.path)

    this.loader.load(join(path))
  }

  async onLoad() {}

  async onUnload() {}
}

export { Piece, PieceContext, Location }

