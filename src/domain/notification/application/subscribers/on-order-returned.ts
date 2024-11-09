import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderReturnedEvent } from '@/domain/delivery/enterprise/events/order-returned-event'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Order "${order.id}" returned`,
    })
  }
}
