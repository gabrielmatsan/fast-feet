import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { CreateDeliveryManUseCase } from './create-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man-factory'

let sut: CreateDeliveryManUseCase
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository

describe('Create Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new CreateDeliveryManUseCase(inMemoryDeliveryManRepository)
  })

  it('should be able to create a delivery man', async () => {
    const deliveryMan = makeDeliveryMan()

    const result = await sut.execute({
      cpf: deliveryMan.cpf,
      name: deliveryMan.name,
      password: deliveryMan.password,
      phone: deliveryMan.phone,
      deliveryManLatitude: deliveryMan.deliveryManLatitude,
      deliveryManLongitude: deliveryMan.deliveryManLongitude,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)
  })

  it('should not be able to create a delivery man with same CPF', async () => {
    const deliveryMan = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: deliveryMan.cpf,
      name: deliveryMan.name,
      password: deliveryMan.password,
      phone: deliveryMan.phone,
      deliveryManLatitude: deliveryMan.deliveryManLatitude,
      deliveryManLongitude: deliveryMan.deliveryManLongitude,
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)
  })
})
