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
      addressId: address.id.toString(),
      recipientId: recipient.id.toString(),
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
  
    // Verificações
    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
  });

  it('should not be able to edit an address from another user', async () => {
    const recipient1 = makeRecipient();
    const recipient2 = makeRecipient();

    const address1 = makeAddress({recipientId: recipient1.id})
    const address2 = makeAddress({recipientId: recipient2.id})


    recipient1.addressId = address1.id
    recipient2.addressId = address2.id

    await inMemoryRecipientRepository.create(recipient1)
    await inMemoryAddressRepository.create(address1)

    await inMemoryRecipientRepository.create(recipient2)
    await inMemoryAddressRepository.create(address2)


    const result = await sut.execute({
      recipientId: recipient2.id.toString(),
      addressId: address1.id.toString(),
      street: address1.street,
      number: address1.number,
      complement: address1.complement,
      neighborhood: address1.neighborhood,
      city: address1.city,
      state: address1.state,
      zipcode: address1.zipcode,
      latitude: address1.latitude,
      longitude: address1.longitude
    })

    expect(result.isLeft()).toBe(true)
  });
})