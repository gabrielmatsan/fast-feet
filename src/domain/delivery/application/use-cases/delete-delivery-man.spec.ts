import  { InMemoryDeliveryManRepository } from "test/repositories/in-memory-delivery-man-repository"
import  { CreateDeliveryManUseCase } from "./create-delivery-man"
import { makeDeliveryMan } from "test/factories/make-delivery-man-factory"
import { DeleteDeliveryManUseCase } from "./delete-delivery-man"
import { FakeHasher } from "test/criptography/fake-hasher"


let sut: DeleteDeliveryManUseCase
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher

describe('Delete Delivery Man', () => {
  beforeEach(()=>{
    fakeHasher = new FakeHasher()
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new DeleteDeliveryManUseCase(inMemoryDeliveryManRepository,fakeHasher)
  })

  it('should be able to delete a delivery man', async () => {
    const deliveryMan = makeDeliveryMan({
      password: await fakeHasher.hash('123456')
    })

    await inMemoryDeliveryManRepository.create(deliveryMan)
    
    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery man with wrong password', async () => {
    const deliveryMan = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryMan)

    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      password: 'wrong-password'
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)
  })
})