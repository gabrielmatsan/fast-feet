import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'
import { OrdersMapper } from '@/infra/database/prisma/mappers/prisma-orders-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      ...override,
      recipientId: override.recipientId ?? new UniqueEntityId(),
      addressId: override.addressId ?? new UniqueEntityId(),
      title: override.title ?? faker.lorem.sentence(),
      content: override.content ?? faker.lorem.sentence(),
      status: override.status ?? 'pending',
      isRemovable: override.isRemovable ?? false,
      paymentMethod: override.paymentMethod ?? 'credit_card',
      createdAt: override.createdAt ?? new Date(),
      expectedDeliveryDate: override.expectedDeliveryDate ?? null,
      deliveryManId: override.deliveryManId ?? null,
      shipping: override.shipping ?? 0,
      deliveryLatitude: override.deliveryLatitude ?? faker.location.latitude(),
      deliveryLongitude:
        override.deliveryLongitude ?? faker.location.longitude(),
    },
    id,
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}
  async makeOrder(override: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(override)

    await this.prisma.order.create({
      data: OrdersMapper.toPersistent(order),
    })

    return order
  }
}
