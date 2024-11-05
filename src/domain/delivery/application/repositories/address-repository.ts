import { Address } from '@/domain/delivery/enterprise/entities/address'

export abstract class AddressRepository {
  abstract create(address: Address): Promise<void>
  abstract update(address: Address): Promise<void>
  abstract delete(address: Address): Promise<void>
  abstract findById(id: string): Promise<Address | null>
  abstract findByRecipientId(recipientId: string): Promise<Address | null>
}
