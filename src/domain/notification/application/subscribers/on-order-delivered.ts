import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderDeliveredEvent } from '@/domain/delivery/enterprise/events/order-delivered-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderDelivered implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderDeliveredEvent) {
    console.log(`Order ${order.id} delivered`)

    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Order "${order.id}" delivered`,
    })
  }
}
