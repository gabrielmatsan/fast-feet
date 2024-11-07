import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient-factory'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makeAddress } from 'test/factories/make-address-factory'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

let sut: CreateOrderUseCase
describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderAttachmentsRepository,
    )

    inMemoryAddressRepository = new InMemoryAddressRepository(
      inMemoryRecipientRepository,
    )

    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository,
      inMemoryAddressRepository,
    )
  })

  it('should be able to create a recipient', async () => {
    // crio o destinatario
    const recipient = makeRecipient()

    // adiciono o destinatario no repositório
    inMemoryRecipientRepository.create(recipient)

    // crio o endereço
    const address = makeAddress({
      recipientId: recipient.id,
    })
    // adiciono o endereço no repositório
    inMemoryAddressRepository.create(address)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      addressId: address.id.toString(),
      title: 'Order title',
      content: 'Order content',
      status: 'pending',
      isRemovable: false,
      paymentMethod: 'credit_card',
      shipping: 0,
      deliveryLatitude: 0,
      deliveryLongitude: 0,
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
  })
})
