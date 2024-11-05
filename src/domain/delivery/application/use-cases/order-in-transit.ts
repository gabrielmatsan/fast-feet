import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "./error/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { OrderRepository } from "../repositories/order-repository"

export interface OrderTransitRequest {
  orderId: string
  deliveryManId: string
}

type OrderTransitResponse = Either<ResourceNotFoundError|NotAllowedError, null>


export class OrderTransitUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({orderId, deliveryManId}: OrderTransitRequest): Promise<OrderTransitResponse>{  

    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
      }

    if(!order.deliveryManId){
      return left(new NotAllowedError())
      }

    if (order.deliveryManId.toString()!== deliveryManId) {
      return left(new NotAllowedError())
    }

    order.markAsInTransit()

    await this.orderRepository.update(order)

    return right(null)
  }
}