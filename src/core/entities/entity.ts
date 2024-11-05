import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityId

  protected props: Props

  constructor(props: Props, id?: UniqueEntityId) {
    this.props = props
    this._id = id || new UniqueEntityId()
  }

  get id() {
    return this._id
  }

  public equals(entity: Entity<unknown>) {
    if (this === entity) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
