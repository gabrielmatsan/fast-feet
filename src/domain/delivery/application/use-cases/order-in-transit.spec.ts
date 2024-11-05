import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order-factory'
import { makeDeliveryMan } from 'test/factories/make-delivery-man-factory'
import { OrderTransitUseCase } from './order-in-transit'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

let sut: OrderTransitUseCase
describe('Order Returned Use Case', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderAttachmentsRepository,
    )

    sut = new OrderTransitUseCase(inMemoryOrderRepository)
  })

  it.only('should be able to mark an order as returned', async () => {
    const deliveryMan = makeDeliveryMan()

    const order = makeOrder({
      deliveryManId: deliveryMan.id,
      status: 'pending',
    })
    inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items[0].status).toEqual('inTransit')
    expect(inMemoryOrderRepository.items[0].deliveryManId).toEqual(
      deliveryMan.id,
    )
  })
})
