import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/delivery/enterprise/entities/address'
import { Prisma, Address as PrismaAddress } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class AddressesMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        street: raw.street,
        number: raw.number,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipcode: raw.zipcode,
        latitude: (raw.latitude as Decimal).toNumber(),
        longitude: (raw.longitude as Decimal).toNumber(),
        recipientId: new UniqueEntityId(raw.recipientId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      recipientId: address.recipientId.toString(),
      complement: address.complement,
      latitude: address.latitude,
      longitude: address.longitude,
      number: address.number,
      city: address.city,
      neighborhood: address.neighborhood,
      state: address.state,
      street: address.street,
      zipcode: address.zipcode,
    }
  }
}
