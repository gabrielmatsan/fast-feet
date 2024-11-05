import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "./error/resource-not-found-error"
import { DeliveryManRepository } from "../repositories/delivery-man-repository"
import { OrderRepository } from "../repositories/order-repository"

export interface AcceptOrderRequest {
  orderId: string
  deliveryManId: string
}

type AcceptOrderResponse = Either<ResourceNotFoundError, null>


export class AcceptOrderUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({ orderId, deliveryManId }: AcceptOrderRequest): Promise<AcceptOrderResponse> {
    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    order.deliveryManId = deliveryMan.id
    order.markAsAwaiting()

    await this.orderRepository.update(order)

    return right(null)
  }
}