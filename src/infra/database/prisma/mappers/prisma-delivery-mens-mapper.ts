import { DeliveryMan as PrismaDeliveryMan, Prisma } from '@prisma/client'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Decimal } from '@prisma/client/runtime/library'

export class DeliveryMensMapper {
  static toDomain(raw: PrismaDeliveryMan): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        phone: raw.phone,
        deliveryManLatitude: (raw.deliveryManLatitude as Decimal).toNumber(),
        deliveryManLongitude: (raw.deliveryManLongitude as Decimal).toNumber(),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(
    raw: DeliveryMan,
  ): Prisma.DeliveryManUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      cpf: raw.cpf,
      password: raw.password,
      phone: raw.phone,
      deliveryManLatitude: raw.deliveryManLatitude,
      deliveryManLongitude: raw.deliveryManLongitude,
    }
  }
}
