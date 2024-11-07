import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'

export interface OrderReturnedRequest {
  orderId: string
  deliveryManId: string
}

type OrderReturnedResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class OrderReturnedUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    deliveryManId,
  }: OrderReturnedRequest): Promise<OrderReturnedResponse> {
    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.deliveryManId) {
      return left(new NotAllowedError())
    }

    if (order.deliveryManId.toString() !== deliveryManId) {
      return left(new NotAllowedError())
    }

    order.markAsReturned()

    await this.orderRepository.update(order)

    return right(null)
  }
}
