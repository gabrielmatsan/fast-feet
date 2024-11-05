import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { OrderDeliveredUseCase } from "./order-delivered"
import { makeOrder } from "test/factories/make-order-factory"
import { makeDeliveryMan } from "test/factories/make-delivery-man-factory"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository"
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository"
import { makeAttachment } from "test/factories/make-attachment-factory"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

let sut: OrderDeliveredUseCase
describe('Order Delivered Use Case', () => {
  beforeEach(()=>{
    inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentsRepository)


    sut = new OrderDeliveredUseCase(inMemoryOrderRepository)
  })

  it('should be able to mark an order as delivered', async () => {

    const deliveryMan = makeDeliveryMan()
    
    const order = makeOrder({
      deliveryManId: deliveryMan.id,
      status: 'awaiting',
    })
    inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      attachmentIds: ['1']
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderRepository.items[0].status).toEqual('delivered')
  })
})