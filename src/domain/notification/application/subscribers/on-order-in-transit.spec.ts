import { makeOrder } from 'test/factories/make-order-factory'
import { OnOrderDelivered } from './on-order-delivered'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'
import { OnOrderInTransit } from './on-order-in-transit'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  type sendNotificationUseCaseRequest,
  type sendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
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

describe('On Order In Transit', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderAttachmentsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnOrderInTransit(sut)
  })

  it('should send a notification when the order is in transit', async () => {
    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    order.markAsInTransit()
    await inMemoryOrderRepository.update(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
