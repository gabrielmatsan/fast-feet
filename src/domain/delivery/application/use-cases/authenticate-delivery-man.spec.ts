import { FakeEncrypter } from 'test/criptography/fake-encrypter'
import { FakeHasher } from 'test/criptography/fake-hasher'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { AuthenticateDeliveryUseCase } from './authenticate-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man-factory'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher

let sut: AuthenticateDeliveryUseCase
describe('Authenticate Delivery Man Recipient', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()

    sut = new AuthenticateDeliveryUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a delivery man', async () => {
    // Crio o entregador
    const deliveryMan = makeDeliveryMan({
      cpf: '12345678901',
      password: await fakeHasher.hash('123456'),
    })

    // Salvo o entregador
    await inMemoryDeliveryManRepository.create(deliveryMan)

    // Faço o login
    const result = await sut.execute({
      cpf: deliveryMan.cpf,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })
})
