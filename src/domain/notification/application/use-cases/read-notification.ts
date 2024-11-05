import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/domain/delivery/application/use-cases/error/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { NotificationRepository } from '../repositories/notification-repository'

interface readNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

type readNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: readNotificationUseCaseRequest): Promise<readNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()
    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
