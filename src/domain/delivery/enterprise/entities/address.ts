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

  set street(street: string) {
    this.props.street = street
  }

  get number() {
    return this.props.number
  }

  set number(number: string) {
    this.props.number = number
  }

  get complement() {
    return this.props.complement ?? null
  }

  set complement(complement: string | null) {
    this.props.complement = complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
  }

  get zipcode() {
    return this.props.zipcode
  }

  set zipcode(zipcode: string) {
    this.props.zipcode = zipcode
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  get recipientId() {
    return this.props.recipientId
  }
}