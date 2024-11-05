import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderReturnedEvent } from '@/domain/delivery/enterprise/events/order-returned-event'

export class OnOrderReturned implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderReturnedEvent) {
    console.log(`Order ${order.id} was returned`)
  }
}
