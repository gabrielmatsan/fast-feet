import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderDeliveredEvent } from "@/domain/delivery/enterprise/events/order-delivered-event";

export class OnOrderDelivered implements EventHandler{
  constructor(){
    this.setupSubscriptions()
  }
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderDeliveredEvent.name
    )
  }

  private async sendNewOrderNotification({order}:OrderDeliveredEvent){
    console.log(`Order ${order.id} delivered`)
  }

}