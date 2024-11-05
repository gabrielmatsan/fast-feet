import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AttachmentOrder,
  AttachmentOrderProps,
} from '@/domain/delivery/enterprise/entities/attachment-order'

export function makeAttachment(
  override: Partial<AttachmentOrderProps> = {},
  id?: UniqueEntityId,
) {
  const attachmentOrder = AttachmentOrder.create(
    {
      attachmentId: new UniqueEntityId(),
      orderId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return attachmentOrder
}
