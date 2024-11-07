import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class RecipientsMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(raw: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      cpf: raw.cpf,
      email: raw.email,
      phone: raw.phone,
      password: raw.password,
    }
  }
}
