import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { OrderRepository } from '../repositories/order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NeedAttachmentError } from './error/need-attachment-error'
import { OrderAttachment } from '../../enterprise/entities/attachment-order'
import { OrderAttachmentList } from '../../enterprise/entities/attachment-order-list'

export interface OrderDeliveredRequest {
  orderId: string
  deliveryManId: string
  attachmentIds: string[]
}

type OrderDeliveredResponse = Either<
  ResourceNotFoundError | NotAllowedError | NeedAttachmentError,
  null
>

export class OrderDeliveredUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    deliveryManId,
    attachmentIds,
  }: OrderDeliveredRequest): Promise<OrderDeliveredResponse> {
    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.deliveryManId) {
      return left(new NotAllowedError())
    }

    if (order.deliveryManId.toString() !== deliveryManId) {
      return left(new NotAllowedError())
    }

    const orderAttachments = attachmentIds.map((attachmentId) => {
      return OrderAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        orderId: order.id,
      })
    })

    if (orderAttachments.length == 0) {
      return left(new NeedAttachmentError(order.id.toString()))
    }

    order.attachments = new OrderAttachmentList(orderAttachments)

    order.markAsDelivered()

    await this.orderRepository.update(order)

    return right(null)
  }
}
