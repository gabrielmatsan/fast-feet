import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient-factory'
import { FakeHasher } from 'test/criptography/fake-hasher'
import { DeleteRecipientUseCase } from './delete-recipient'
import { WrongCredentialsError } from './error/wrong-credentials-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let fakeHasher: FakeHasher
let sut: DeleteRecipientUseCase
describe('Delete Recipient', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()

    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository, fakeHasher)
  })

  it('should be able to delete a recipient', async () => {
    // crio o destinatario
    const recipient = makeRecipient({
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryRecipientRepository.create(recipient)

    expect(inMemoryRecipientRepository.items).toHaveLength(1)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      password: '123456',
    })
    // verificações
    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a recipient with wrong password', async () => {
    // crio o destinatario
    const recipient = makeRecipient({
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryRecipientRepository.create(recipient)

    expect(inMemoryRecipientRepository.items).toHaveLength(1)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      password: 'wrong-password',
    })

    // verificações
    expect(result.isLeft()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
