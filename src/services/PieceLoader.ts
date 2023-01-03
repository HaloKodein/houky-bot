import type { Piece } from '../entities/core/Piece'
import { LoadStrategy, ILoadResultEntry } from './LoadStrategy'
import { readdir } from 'fs/promises'
import { join } from 'path'

interface PieceLoaderOptions {
  readonly name: string
  readonly paths?: string[]
}

class PieceLoader<T extends Piece> extends Map<string, T> {
  readonly name: string
  readonly paths: Set<string>
  loadStrategy: LoadStrategy<T>

  constructor(options: PieceLoaderOptions) {
    super()

    this.name = options.name
    this.loadStrategy = new LoadStrategy()
    this.paths = new Set(options.paths ?? [])
  }

  registryPath(path: string): PieceLoader<T> {
    this.paths.add(path)

    return this
  }

  async insert(name: string, piece: T): Promise<void> {
    const alreadyHave = this.get(name)

    if (alreadyHave) {
      console.log(
        `[PieceLoader -> ${this.name}] Override ${name} piece.`)

      await this.unload(name)
    }

    console.log(
      `[PieceLoader -> ${this.name}] Loaded ${name} piece.`)

    await piece.onLoad()

    this.set(name, piece)
  }

  async unload(name: string): Promise<unknown> {
    const piece = this.get(name)

    if (!piece) return

    console.log(
      `[PieceLoader -> ${this.name}] Unloaded ${name} piece.`)

    await piece.onUnload()
    this.delete(name)
  }

  async load(path: string): Promise<void> {
    const Ctor = await this
      .loadStrategy
      .loadFile(path) as ILoadResultEntry<T>

    const info = this
      .loadStrategy
      .parse(path)

    const piece = new Ctor({
      name: info.name,
      path: info.path,
      root: info.root,
      loader: this
    })

    await this.insert(piece.name, piece)
  }

  async reload(name: string): Promise<void> {
    const piece = this.get(name)

    if (!piece)
      throw new Error(`The ${name} piece not exists.`)

    const path = piece.location.path

    await this.unload(name)

    await this.load(path)
  }

  async loadAll(): Promise<void> {
    const promises = []

    for (const path of this.paths) {
      const files = await readdir(path)

      for (const file of files) {
        promises.push(this.load(join(path, file)))
      }
    }

    await Promise.all(promises)
  }
}

export { PieceLoader }

