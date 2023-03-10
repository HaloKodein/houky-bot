import { Document } from 'mongoose'

abstract class Wrapper<T1, T2 extends Document> {
  get(identifier: T1) {
    return this.getOrCreate(identifier);
  }

  protected abstract getOrCreate(type: T1): Promise<T2>;
  protected abstract create(type: T1): Promise<T2>;

  save(savedType: T2) {
    return savedType.save();
  }
}

export { Wrapper }

