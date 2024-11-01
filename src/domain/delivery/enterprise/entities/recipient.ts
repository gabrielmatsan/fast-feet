import { Entity } from "@/core/entities/entity"
import  { Address } from "./address"
import type { UniqueEntityId } from "@/core/entities/unique-entity-id"

export interface RecipientProps {

  // dados pessoais
  name: string
  cpf: string
  email: string
  phone: string
  password: string

  address: Address
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

  get address() {
    return this.props.address
  }
}