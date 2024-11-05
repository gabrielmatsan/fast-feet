import { makeOrder } from "test/factories/make-order-factory"
import { OnOrderDelivered } from "./on-order-delivered"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository"
import { OrderDeliveredEvent } from "@/domain/delivery/enterprise/events/order-delivered-event"
import { DomainEvents } from "@/core/events/domain-events"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

describe('On Order Delivered', () => {

  beforeEach(() => {
    inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentsRepository)
  })

  it('should send a notification when the order is delivered', async () => {
    const onOrderDelivered = new OnOrderDelivered()
    
    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    order.markAsDelivered()
    await inMemoryOrderRepository.update(order)
  })
})