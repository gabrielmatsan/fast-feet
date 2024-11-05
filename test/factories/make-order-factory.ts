import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'
import { Slug } from '@/domain/delivery/enterprise/entities/value-objects/slug'
import { faker } from '@faker-js/faker'

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
