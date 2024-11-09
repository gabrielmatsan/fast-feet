import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderInTransitEvent } from '@/domain/delivery/enterprise/events/order-in-transit-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderInTransit implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderInTransitEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderInTransitEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Order "${order.id}" in transit`,
    })
  }
}
