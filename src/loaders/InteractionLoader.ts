import { PieceLoader } from '../services/PieceLoader'
import { Interaction } from '../entities/Interaction'

class InteractionLoader extends PieceLoader<Interaction> {
  constructor() {
    super({ name: 'interactions' })
  }
}

export { InteractionLoader }

