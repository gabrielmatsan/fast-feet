import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/address'
import { AddressRepository } from '../repositories/address-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

export interface EditAddressRequest {
  recipientId: string
  addressId: string
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

@Injectable()
export class EditAddressUseCase {
  constructor(
    private addressRepository: AddressRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute(addressData: EditAddressRequest): Promise<EditAddressResponse> {
    // Encontre o endereço pelo addressId
    const address = await this.addressRepository.findById(addressData.addressId)

    if (!address) {
      return left(new ResourceNotFoundError())
    }

    // Verifique se o recipientId do endereço corresponde ao recipientId fornecido
    if (address.recipientId.toString() !== addressData.recipientId) {
      return left(new NotAllowedError())
    }

    // Atualize o endereço com os novos dados
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
