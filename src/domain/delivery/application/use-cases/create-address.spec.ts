import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient-factory'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makeAddress } from 'test/factories/make-address-factory'
import { CreateAddressUseCase } from './create-address'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: CreateAddressUseCase
describe('Create Address', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository(
      inMemoryRecipientRepository,
    )

    sut = new CreateAddressUseCase(
      inMemoryAddressRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to create an address', async () => {
    // Crio o destinatário e o endereço
    const recipient = makeRecipient()

    inMemoryRecipientRepository.create(recipient)

    const address = makeAddress()

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      latitude: address.latitude,
      longitude: address.longitude,
    })

    expect(result.isRight()).toBe(true)
  })
})
