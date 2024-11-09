import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered'
import { OnOrderInTransit } from '@/domain/notification/application/subscribers/on-order-in-transit'
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderDelivered,
    OnOrderInTransit,
    OnOrderReturned,
    SendNotificationUseCase,
  ],
  exports: [],
})
export class EventsModule {}
