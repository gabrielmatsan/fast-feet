import { Either, left, right } from '@/core/either'
import { Order, OrderStatus } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { AddressRepository } from '../repositories/address-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface CreateOrderRequest {
  recipientId: string
  addressId: string
  title: string
  content: string
  status: OrderStatus // Definir com o tipo OrderStatus
  isRemovable: boolean
  paymentMethod: string
  shipping: number
  deliveryLatitude: number
  deliveryLongitude: number
}

type CreateOrderResponse = Either<null, { order: Order }>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
    status,
    isRemovable,
    paymentMethod,
    shipping,
    deliveryLatitude,
    deliveryLongitude,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)
    if (!recipient) {
      return left(null)
    }

    const address = await this.addressRepository.findByRecipientId(recipientId)
    if (!address) {
      return left(null)
    }

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      addressId: address.id,
      title,
      content,
      status,
      isRemovable,
      paymentMethod,
      shipping,
      deliveryLatitude,
      deliveryLongitude,
      createdAt: new Date(), // Define createdAt como a data atual
    })

    await this.orderRepository.create(order)

    return right({ order })
  }
}
