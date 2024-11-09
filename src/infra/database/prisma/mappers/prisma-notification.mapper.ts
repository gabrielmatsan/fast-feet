import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
export class NotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    // Create a new domain Notification object using the properties from the raw PrismaNotification
    return Notification.create(
      {
        title: raw.title,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersitent(
    raw: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      recipientId: raw.recipientId.toString(),
      title: raw.title,
      readAt: raw.readAt,
      createdAt: raw.createdAt,
    }
  }
}
