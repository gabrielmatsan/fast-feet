import { Entity } from "@/core/entities/entity"
import  { Address } from "./address"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export interface RecipientProps {
  name: string
  cpf: string
  email: string
  phone: string
  password: string

  addressId?: UniqueEntityId | null
}


export class Recipient extends Entity<RecipientProps>{
  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(props, id)

    return recipient
  }

  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get password() {
    return this.props.password
  }

  get addressId() {
    return this.props.addressId ?? null
  }

  set addressId(addressId: UniqueEntityId | null) {
    this.props.addressId = addressId
  }
}