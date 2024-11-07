import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/delivery/enterprise/entities/delivery-man'
import { DeliveryMensMapper } from '@/infra/database/prisma/mappers/prisma-delivery-mens-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId,
) {
  return DeliveryMan.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? faker.string.numeric(11),
      password: override.password ?? faker.internet.password(),
      phone: override.phone ?? faker.phone.number(),
      deliveryManLatitude:
        override.deliveryManLatitude ?? faker.location.latitude(),
      deliveryManLongitude:
        override.deliveryManLongitude ?? faker.location.longitude(),
    },
    id,
  )
}

@Injectable()
export class DeliveryManFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryMan(data: Partial<DeliveryManProps> = {}) {
    const deliveryMan = makeDeliveryMan(data)

    await this.prisma.deliveryMan.create({
      data: DeliveryMensMapper.toPersistent(deliveryMan),
    })

    return deliveryMan
  }
}
