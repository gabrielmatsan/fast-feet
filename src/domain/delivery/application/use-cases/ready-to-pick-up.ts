import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { OrderRepository } from "../repositories/order-repository"
import { ResourceNotFoundError } from "./error/resource-not-found-error"

export interface ReadyToPickUpRequest {
  orderId: string
  recipientId: string
}

type ReadyToPickUpResponse = Either<NotAllowedError | ResourceNotFoundError, null>

export class ReadyToPickUpUseCase {
  constructor(private orderRepository: OrderRepository ) {}

  async execute({ orderId, recipientId }: ReadyToPickUpRequest): Promise<ReadyToPickUpResponse> {
    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.recipientId.toString()!== recipientId) {
      return left(new NotAllowedError())
    }

    order.isRemovable = true

    await this.orderRepository.update(order)

    return right(null)
  }
}