import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Recipient } from "./recipient";
import { Address } from "./address";

describe('Recipient', () => {
  it('should create a recipient successfully with all attributes', () => {
    // Criação de uma instância de Address
    
    // Criação do ID único
    const recipientId = new UniqueEntityId();
    const id = new UniqueEntityId();

    // Criação da instância de Recipient
    const recipient = Recipient.create({
      name: "João da Silva",
      cpf: "123.456.789-00",
      email: "joao.silva@example.com",
      phone: "(11) 98765-4321",
      password: "senha123",
    }, recipientId);

    // Criação da instância de Address
    const address = Address.create({
      recipientId,
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipcode: "01000-000",
      latitude: -23.5505,
      longitude: -46.6333
    });

    recipient.addressId = address.id;
    // Verificações
    expect(recipient).toBeInstanceOf(Recipient);
    expect(recipient.name).toBe("João da Silva");
    expect(recipient.cpf).toBe("123.456.789-00");
    expect(recipient.email).toBe("joao.silva@example.com");
    expect(recipient.phone).toBe("(11) 98765-4321");
    expect(recipient.password).toBe("senha123");
  });
});