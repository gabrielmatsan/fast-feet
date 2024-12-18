import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'

export interface FetchNearbyOrdersRequest {
  deliveryManId: string
  deliveryManlatitude: number
  deliveryManlongitude: number
  maxDistance: number
}

type FetchNearbyOrdersResponse = Either<
  ResourceNotFoundError,
  { orders: Order[] }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}

  async execute({
    deliveryManId,
    deliveryManlatitude,
    deliveryManlongitude,
    maxDistance,
  }: FetchNearbyOrdersRequest): Promise<FetchNearbyOrdersResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    const deliveryManLocation = {
      latitude: deliveryManlatitude,
      longitude: deliveryManlongitude,
    }

    const nearbyOrders = await this.orderRepository.findManyNearby({
      deliveryLatitude: deliveryManLocation.latitude,
      deliveryLongitude: deliveryManLocation.longitude,
      maxDistance,
    })

    return right({ orders: nearbyOrders })
  }
}
