import { AddressRepository } from '@/domain/delivery/application/repositories/address-repository'
import { Address } from '@/domain/delivery/enterprise/entities/address'
import { InMemoryRecipientRepository } from './in-memory-recipient-repository'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []

  constructor(
    private inMemoryRecipientRepository: InMemoryRecipientRepository,
  ) {}

  async create(address: Address) {
    this.items.push(address)
  }

  async update(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items[itemIndex] = address
  }

  async delete(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id)

    if (!address) {
      return null
    }

    return address
  }

  async findByRecipientId(recipientId: string) {
    // procuro o destinatário
    const recipient = this.inMemoryRecipientRepository.items.find(
      (item) => item.id.toString() === recipientId,
    )

    if (!recipient) {
      return null
    }

    // procuro o endereço pelo id do destinatário
    const address = this.items.find(
      (item) => item.recipientId.toString() === recipientId,
    )

    if (!address) {
      return null
    }

    return address
  }
}
