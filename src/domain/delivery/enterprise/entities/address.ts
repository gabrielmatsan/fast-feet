import { Entity } from "@/core/entities/entity"
import  { UniqueEntityId } from "@/core/entities/unique-entity-id"
import  { Optional } from "@/core/types/optional"

export interface AddressProps{
  recipientId: UniqueEntityId
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipcode: string
  latitude: number
  longitude: number
}


export class Address extends Entity<AddressProps>{
  
  static create(props:Optional<AddressProps, 'complement'>, id?: UniqueEntityId):Address{
    const complementProps = {
      ...props,
      complement: props.complement ?? null
    }

    return new Address(complementProps, id)

  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get zipcode() {
    return this.props.zipcode
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }
}