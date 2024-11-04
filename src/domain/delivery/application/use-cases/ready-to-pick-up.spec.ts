import  { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factories/make-recipient-factory"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { makeAddress } from "test/factories/make-address-factory"
import { ReadyToPickUpUseCase } from "./ready-to-pick-up"
import { makeOrder } from "test/factories/make-order-factory"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository

let sut: ReadyToPickUpUseCase
describe('Ready to Pick Up', () => {
  beforeEach(()=>{

    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()

    sut = new ReadyToPickUpUseCase(inMemoryOrderRepository)
  })

  it('should be able to mark an order as ready to collection(pick-up)', async () => {
    
    const order = makeOrder({
      isRemovable: false
    })

    inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      recipientId:order.recipientId.toString(),
      orderId:order.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].isRemovable).toBe(true)
  })
})