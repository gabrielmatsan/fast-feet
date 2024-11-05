import { WatchedList } from '@/core/entities/watched-list'
import { OrderAttachment } from './attachment-order'

export class OrderAttachmentList extends WatchedList<OrderAttachment> {
  compareItems(a: OrderAttachment, b: OrderAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
