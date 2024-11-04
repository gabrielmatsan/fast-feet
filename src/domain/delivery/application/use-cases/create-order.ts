import { Either, left, right } from "@/core/either"
import { Order, OrderStatus } from "../../enterprise/entities/order"
import { OrderRepository } from "../repositories/order-repository"
import { AddressRepository } from "../repositories/address-repository"
import { RecipientRepository } from "../repositories/recipient-repository"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

export interface CreateOrderRequest {
  recipientId: string
  deliveryManId?: string | null
  addressId: string
  title: string
  content: string
  status: OrderStatus // Definir com o tipo OrderStatus
  isRemovable: boolean
  paymentMethod: string
  expectedDeliveryDate: Date | null
  shipping: number
  deliveryLatitude: number
  deliveryLongitude: number
}

type CreateOrderResponse = Either<null, { order: Order }>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({
    recipientId,
    deliveryManId,
    title,
    content,
    status,
    isRemovable,
    paymentMethod,
    expectedDeliveryDate,
    shipping,
    deliveryLatitude,
    deliveryLongitude,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {

    const recipient = await this.recipientRepository.findById(recipientId)
    if (!recipient) {
      return left(null)
    }

    const address = await this.addressRepository.findByRecipientId(recipientId)
    if (!address) {
      return left(null)
    }

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      deliveryManId: deliveryManId ? new UniqueEntityId(deliveryManId) : null,
      addressId: address.id,
      title,
      content,
      status,
      isRemovable,
      paymentMethod,
      expectedDeliveryDate,
      shipping,
      deliveryLatitude,
      deliveryLongitude,
    })

    await this.orderRepository.create(order)

    return right({ order })
  }
}