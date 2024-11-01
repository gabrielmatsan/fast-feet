import { Entity } from "@/core/entities/entity"
import  { UniqueEntityId } from "@/core/entities/unique-entity-id"

export interface DeliveryManProps {
  cpf: string
  name: string
  email: string
  password: string
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  static create(props: DeliveryManProps, id?:UniqueEntityId) {
    const deliveryMan = new DeliveryMan(props, id)

    return deliveryMan
  }

  get cpf() {
    return this.props.cpf
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }
}