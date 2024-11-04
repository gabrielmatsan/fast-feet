import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryDeliveryManRepository } from "test/repositories/in-memory-delivery-man-repository"
import { AcceptOrderUseCase } from "./accept-order"
import { makeOrder } from "test/factories/make-order-factory"
import { makeDeliveryMan } from "test/factories/make-delivery-man-factory"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository

let sut: AcceptOrderUseCase

describe('Accept Order', () => {
  beforeEach(()=>{

    inMemoryOrderRepository = new InMemoryOrderRepository()

    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()

    sut = new AcceptOrderUseCase(inMemoryDeliveryManRepository,inMemoryOrderRepository)
  })

  it('should be able to create a recipient', async () => {
    // crio o destinatario
    const order = makeOrder()
    inMemoryOrderRepository.create(order)

    // crio o entregador
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.create(deliveryMan)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString()
    })

    // verificações
    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].deliveryManId).toEqual(deliveryMan.id)
  })
})