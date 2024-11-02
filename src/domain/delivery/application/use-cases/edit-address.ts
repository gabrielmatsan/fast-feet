import { Either, left, right } from "@/core/either"
import { Address } from "../../enterprise/entities/address"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { AddressRepository } from "../repositories/address-repository"
import { RecipientRepository } from "../repositories/recipient-repository"
import { ResourceNotFoundError } from "./error/resource-not-found-error"

export interface EditAddressRequest {
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

type EditAddressResponse = Either<ResourceNotFoundError, { address: Address }>

export class EditAddressUseCase{
  constructor(private addressRepository: AddressRepository, private recipientRepository: RecipientRepository){}

  async execute(addressData: EditAddressRequest): Promise<EditAddressResponse>{
    
    // verificar se destinatario existe
    const recipient = await this.recipientRepository.findById(addressData.recipientId.toString())

    // erro se nao existir
    if (!recipient){
      return left(new ResourceNotFoundError())
    }

    // verificar se o destinatario tem endereço
    const address = await this.addressRepository.findByRecipientId(addressData.recipientId.toString())

    // se nao tiver, nao tem sentindo em editar
    if(!address){
      return left(new ResourceNotFoundError())
    }

    // edita o endereço
    address.city = addressData.city
    address.complement = addressData.complement ?? null
    address.latitude = addressData.latitude
    address.longitude = addressData.longitude
    address.number = addressData.number
    address.neighborhood = addressData.neighborhood
    address.state = addressData.state
    address.street = addressData.street
    address.zipcode = addressData.zipcode
    
    await this.addressRepository.update(address)

    return right({ address })

  }
}
