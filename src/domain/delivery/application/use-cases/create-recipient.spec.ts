import  { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { CreateRecipientUseCase } from "./create-recipient"
import { makeRecipient } from "test/factories/make-recipient-factory"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase
describe('Create Delivery Man', () => {
  beforeEach(()=>{
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to create a delivery man', async () => {
    // crio o destinatario
    const recipient = makeRecipient()

    const result = await sut.execute({
      name: recipient.name,
      cpf: recipient.cpf,
      email: recipient.email,
      password: recipient.password,
      phone: recipient.phone,
    })

    // adiciono na memoria
    inMemoryRecipientRepository.create(recipient)

    // verificações
    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })
})