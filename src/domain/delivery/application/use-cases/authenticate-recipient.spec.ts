import { FakeEncrypter } from 'test/criptography/fake-encrypter'
import { FakeHasher } from 'test/criptography/fake-hasher'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { AuthenticateRecipientUseCase } from './authenticate-recipient'
import { makeRecipient } from 'test/factories/make-recipient-factory'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher

let sut: AuthenticateRecipientUseCase
describe('Authenticate Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()

    sut = new AuthenticateRecipientUseCase(
      inMemoryRecipientRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a recipient', async () => {
    // Crio o destinatário
    const recipient = makeRecipient({
      cpf: '12345678901',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      cpf: recipient.cpf,
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
