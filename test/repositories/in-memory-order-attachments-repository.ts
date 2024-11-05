import { OrderAttachmentRepository } from '@/domain/delivery/application/repositories/order-attachments-repository'
import { OrderAttachment } from '@/domain/delivery/enterprise/entities/attachment-order'

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentRepository
{
  public items: OrderAttachment[] = []

  async createMany(attachments: OrderAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: OrderAttachment[]) {
    const orderAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = orderAttachments
  }

  async findManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
    const orderAttachments = this.items.filter((item) => {
      return item.orderId.toString() === orderId
    })

    return orderAttachments
  }

  async deleteManyByOrderId(orderId: string) {
    const orderAttachments = this.items.filter((item) => {
      return item.orderId.toString() !== orderId
    })

    this.items = orderAttachments
  }
}
