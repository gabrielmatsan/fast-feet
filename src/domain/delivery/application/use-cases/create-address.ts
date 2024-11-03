import { Either, left, right } from "@/core/either"
import { Address } from "../../enterprise/entities/address"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { AddressRepository } from "../repositories/address-repository"
import { RecipientRepository } from "../repositories/recipient-repository"
import { ResourceNotFoundError } from "./error/resource-not-found-error"

export interface CreateAddressRequest {
  recipientId: string
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

type CreateAddressResponse = Either<ResourceNotFoundError, { address: Address }>

export class CreateAddressUseCase{
  constructor(private addressRepository: AddressRepository, private recipientRepository: RecipientRepository){}

  async execute(addressData: CreateAddressRequest): Promise<CreateAddressResponse>{

    const recipient = await this.recipientRepository.findById(addressData.recipientId.toString())

    if (!recipient){
      return left(new ResourceNotFoundError())
    }

    const address = Address.create({
      recipientId: new UniqueEntityId(addressData.recipientId),
      street: addressData.street,
      number: addressData.number,
      complement: addressData.complement,
      neighborhood: addressData.neighborhood,
      city: addressData.city,
      state: addressData.state,
      zipcode: addressData.zipcode,
      latitude: addressData.latitude,
      longitude: addressData.longitude
    })

    await this.addressRepository.create(address)

    return right({ address })

  }
}
