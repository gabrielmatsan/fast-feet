import { Order } from '../../enterprise/entities/order'

export interface findManyNearbyParams {
  deliveryLatitude: number
  deliveryLongitude: number
  maxDistance: number
}

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract update(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract findByOrderId(id: string): Promise<Order | null>
  abstract findManyNearby(params: findManyNearbyParams): Promise<Order[]>
}
