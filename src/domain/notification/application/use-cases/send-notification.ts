import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface sendNotificationUseCaseRequest {
  recipientId: string
  title: string
}

export type sendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
  }: sendNotificationUseCaseRequest): Promise<sendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
    })

    await this.notificationRepository.create(notification)

    return right({ notification })
  }
}
