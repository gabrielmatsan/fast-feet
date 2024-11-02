import  { OrderRepository } from "@/domain/delivery/application/repositories/order-repository"
import  { Order } from "@/domain/delivery/enterprise/entities/order"


export class InMemoryOrderRepository implements OrderRepository{

  public items: Order[] = []
  async create(order: Order) {
    this.items.push(order)
  }
  async update(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }
  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
  async findByOrderId(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findBySlug(slug: string): Promise<Order | null> {
    const order = this.items.find((item) => item.slug.value === slug)

    if (!order) {
      return null
    }

    return order
  }
}