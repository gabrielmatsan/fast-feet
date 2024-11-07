import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Order as PrismaOrder } from '@prisma/client'

export class OrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        deliveryManId: raw.deliveryManId
          ? new UniqueEntityId(raw.deliveryManId)
          : null,
        addressId: new UniqueEntityId(raw.addressId),
        title: raw.title,
        content: raw.content,
        status: raw.status,
        isRemovable: raw.isRemovable,
        paymentMethod: raw.paymentMethod,
        createdAt: raw.createdAt,
        expectedDeliveryDate: raw.expectedDeliveryDate,
        deliveryLatitude: raw.deliveryLatitude,
        deliveryLongitude: raw.deliveryLongitude,
        shipping: raw.shipping,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(order: Order): PrismaOrder {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryManId: order.deliveryManId?.toString() ?? null,
      addressId: order.addressId.toString(),
      title: order.title,
      content: order.content,
      status: order.status,
      isRemovable: order.isRemovable,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? null,
      expectedDeliveryDate: order.expectedDeliveryDate,
      deliveryLatitude: order.deliveryLatitude,
      deliveryLongitude: order.deliveryLongitude,
      shipping: order.shipping,
    }
  }
}
