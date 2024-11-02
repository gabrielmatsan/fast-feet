import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Address, AddressProps } from "@/domain/delivery/enterprise/entities/address";
import { faker } from "@faker-js/faker";

export function makeAddress(override: Partial<AddressProps> = {}, id?: UniqueEntityId) {
  const address = Address.create({
    ...override,
    recipientId: override.recipientId ?? new UniqueEntityId(),
    street: override.street ?? faker.location.street(),
    number: override.number ?? faker.location.zipCode(),
    neighborhood: override.neighborhood ?? faker.lorem.word(),
    city: override.city ?? faker.location.city(),
    state: override.state ?? faker.location.state(),
    zipcode: override.zipcode ?? faker.location.zipCode(),
    latitude: override.latitude ?? faker.location.latitude(),
    longitude: override.longitude ?? faker.location.longitude(),
  }, id);

  return address
}
