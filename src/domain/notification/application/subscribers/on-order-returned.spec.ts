import { makeOrder } from 'test/factories/make-order-factory'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'
import { OnOrderReturned } from './on-order-returned'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

describe('On Order Was Returned', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderAttachmentsRepository,
    )
  })

  it('should send a notification when the order was returned', async () => {
    const onOrderReturned = new OnOrderReturned()

    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    order.markAsReturned()
    await inMemoryOrderRepository.update(order)
  })
})
