import { makeOrder } from 'test/factories/make-order-factory'
import { OnOrderDelivered } from './on-order-delivered'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'
import {
  SendNotificationUseCase,
  type sendNotificationUseCaseRequest,
  type sendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: sendNotificationUseCaseRequest,
  ) => Promise<sendNotificationUseCaseResponse>
>

describe('On Order Delivered', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderAttachmentsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnOrderDelivered(sut)
  })

  it('should send a notification when the order is delivered', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    order.markAsDelivered()
    await inMemoryOrderRepository.update(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
