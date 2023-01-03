import { PieceLoader } from '../services/PieceLoader'
import { Listener } from '../entities/Listener'

class ListenerLoader extends PieceLoader<Listener<any>> {
  constructor() {
    super({ name: 'listeners' })
  }
}

export { ListenerLoader }

