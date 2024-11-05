import { DeliveryMan } from '../../enterprise/entities/delivery-man'

export abstract class DeliveryManRepository {
  abstract create(deliveryMan: DeliveryMan): Promise<void>
  abstract update(deliveryMan: DeliveryMan): Promise<void>
  abstract delete(deliveryMan: DeliveryMan): Promise<void>
  abstract findById(id: string): Promise<DeliveryMan | null>
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>
}
