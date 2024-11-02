import  { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factories/make-recipient-factory"
import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository"
import { EditAddressUseCase } from "./edit-address"
import { makeAddress } from "test/factories/make-address-factory"

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: EditAddressUseCase
describe('Edit Address', () => {
  beforeEach(()=>{

    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository(inMemoryRecipientRepository)

    sut = new EditAddressUseCase(inMemoryAddressRepository,inMemoryRecipientRepository)
  })

  it('should be able to edit an address', async () => {
    // Crio o destinatário e o endereço
    const recipient = makeRecipient();
    const address = makeAddress({
      recipientId: recipient.id,
    });
  
    // Associo o endereço ao destinatário e adiciono ambos ao repositório
    recipient.addressId = address.id;
    await inMemoryRecipientRepository.create(recipient);
    await inMemoryAddressRepository.create(address);
  
    // Dados do novo endereço para atualizar
    const updatedAddressData = {
      recipientId: recipient.id,
      street: 'Updated Street',
      number: '456',
      complement: 'Apt. 789',
      neighborhood: 'Updated Neighborhood',
      city: 'Updated City',
      state: 'UC',
      zipcode: '67890',
      latitude: 60.0,
      longitude: -120.0,
    };
  
    // Executa o caso de uso
    const result = await sut.execute(updatedAddressData);
    console.log(updatedAddressData.recipientId)
    console.log(address.recipientId)
    console.log(updatedAddressData.recipientId===address.recipientId)
  
    // Verificações
    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
  });
})