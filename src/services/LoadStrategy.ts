import { readdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { Piece } from '../entities/core/Piece'

type Arr = readonly any[]

type Ctor<A extends Arr = readonly any[], R = any>
  = new (...args: A) => R

type ILoadResultEntry<T extends Piece>
  = Ctor<ConstructorParameters<typeof Piece>, T>

class LoadStrategy<T extends Piece> {
  parse(path: string) {
    const extension = extname(path)
    const name = basename(path, extension)
    const root = path.replace(name, '')

    return { name, root, path, extension }
  }

  async loadFile(path: string) {
    const value = await import(path)
    let ctor = null

    for (const Ctor of Object.values(value)) {
      ctor = Ctor as ILoadResultEntry<T>
    }

    return ctor
  }

  async loadDir(path: string) {
    const files = await readdir(path)
    let ctor = null

    for (const file of files) {
      ctor = this.loadFile(join(path, file))
    }

    return ctor
  }
}

export { LoadStrategy, ILoadResultEntry }

