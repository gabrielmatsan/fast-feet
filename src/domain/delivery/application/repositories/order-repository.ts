import { Order } from "../../enterprise/entities/order";

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract update(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract findByOrderId(id: string): Promise<Order | null>
  abstract findBySlug(slug: string): Promise<Order | null>
}