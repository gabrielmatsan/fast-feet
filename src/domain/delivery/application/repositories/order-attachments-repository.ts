import type { OrderAttachment } from "../../enterprise/entities/attachment-order";

export abstract class OrderAttachmentRepository{
  abstract createMany(attachments: OrderAttachment[]): Promise<void>
  abstract deleteMany(attachments: OrderAttachment[]): Promise<void>
  abstract findManyByOrderId(orderId: string): Promise<OrderAttachment[]>
  abstract deleteManyByOrderId(orderId: string): Promise<void>
}