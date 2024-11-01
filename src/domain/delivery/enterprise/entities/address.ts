import type { Optional } from "@/core/types/optional"

export interface AddressProps{
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipcode: string
}


export class Address{
  
  private props: AddressProps

  constructor(props: AddressProps){
    this.props = props
  }
  static create(props:Optional<AddressProps, 'complement'>):Address{
    const complementProps = {
      ...props,
      complement: props.complement ?? null
    }

    return new Address(complementProps)

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
}