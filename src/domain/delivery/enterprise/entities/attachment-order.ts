import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AttachmentOrderProps {
  orderId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class OrderAttachment extends Entity<AttachmentOrderProps> {
  static create(props: AttachmentOrderProps, id?: UniqueEntityId) {
    const attachmentOrder = new OrderAttachment(props, id)

    return attachmentOrder
  }

  get orderId() {
    return this.props.orderId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
