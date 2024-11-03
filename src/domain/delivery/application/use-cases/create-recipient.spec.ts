import  { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { CreateRecipientUseCase } from "./create-recipient"
import { makeRecipient } from "test/factories/make-recipient-factory"
import { FakeHasher } from "test/criptography/fake-hasher"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let fakeHasher: FakeHasher
let sut: CreateRecipientUseCase
describe('Create Recipient', () => {
  beforeEach(()=>{
    fakeHasher = new FakeHasher()

    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new CreateRecipientUseCase(inMemoryRecipientRepository,fakeHasher)
  })

  it('should be able to create a recipient', async () => {
    // crio o destinatario
    const recipient = makeRecipient()

    const result = await sut.execute({
      name: recipient.name,
      cpf: recipient.cpf,
      email: recipient.email,
      password: '123456',
      phone: recipient.phone,
    })

    const hashedPassword = await fakeHasher.hash('123456')

    // verificações
    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
    expect(inMemoryRecipientRepository.items[0].password).toEqual(hashedPassword)
  })
})