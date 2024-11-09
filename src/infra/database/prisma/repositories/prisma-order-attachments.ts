import { OrderAttachmentRepository } from '@/domain/delivery/application/repositories/order-attachments-repository'
import { OrderAttachment } from '@/domain/delivery/enterprise/entities/attachment-order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderAttachmentsMapper } from '../mappers/prisma-order-attachments-mapper'

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentRepository
{
  constructor(private prisma: PrismaService) {}
  async createMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = OrderAttachmentsMapper.toPersistentUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async findManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
    const orderAttachments = await this.prisma.attachment.findMany({
      where: {
        orderId,
      },
    })

    return orderAttachments.map(OrderAttachmentsMapper.toDomain)
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        orderId,
      },
    })
  }
}
