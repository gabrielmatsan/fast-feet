import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Recipient, RecipientProps } from '@/domain/delivery/enterprise/entities/recipient';
import {faker} from '@faker-js/faker'

export function makeRecipient(override: Partial<RecipientProps> = {}, id?: UniqueEntityId) {
  return Recipient.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? faker.string.numeric(11),
      email: override.email ?? faker.internet.email(),
      password: override.password ?? faker.internet.password(),
      phone: override.phone ?? faker.phone.number(),
      },
    id,
  );
}
