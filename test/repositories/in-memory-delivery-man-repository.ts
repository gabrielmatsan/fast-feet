import { DeliveryManRepository } from "@/domain/delivery/application/repositories/delivery-man-repository";
import { DeliveryMan } from "@/domain/delivery/enterprise/entities/delivery-man";

export class InMemoryDeliveryManRepository implements DeliveryManRepository{

  public items: DeliveryMan[] = []
  async create(deliveryman: DeliveryMan) {
    this.items.push(deliveryman)
  }
  async update(deliveryman: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }
  async delete(deliveryman: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items.splice(itemIndex, 1)
  }
  async findById(id: string) {
    const deliveryMan = this.items.find((item) => item.id.toString() === id)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((item) => item.cpf === cpf)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }
}