import { Entity } from "@/core/entities/entity"
import  { UniqueEntityId } from "@/core/entities/unique-entity-id"

export interface DeliveryManProps {
  cpf: string
  name: string
  password: string
  phone: string
  deliveryManLatitude?: number | null; // Localização atual do entregador (opcional no início)
  deliveryManLongitude?: number | null;
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

  get password() {
    return this.props.password
  }

  get deliveryManLatitude() {
    return this.props.deliveryManLatitude ?? null
  }

  get deliveryManLongitude() {
    return this.props.deliveryManLongitude ?? null
  }

  get phone() {
    return this.props.phone
  }
}