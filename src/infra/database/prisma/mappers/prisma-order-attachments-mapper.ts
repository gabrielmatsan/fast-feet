import { OrderAttachment } from '@/domain/delivery/enterprise/entities/attachment-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

export class OrderAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error('Order ID is required')
    }

    return OrderAttachment.create(
      {
        orderId: new UniqueEntityId(raw.orderId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(
    attachments: OrderAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        orderId: attachments[0].orderId.toString(),
      },
    }
  }
}
