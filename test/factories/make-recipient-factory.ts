import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient'
import { RecipientsMapper } from '@/infra/database/prisma/mappers/prisma-recipients-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) {
  return Recipient.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? faker.string.numeric(11),
      email: override.email ?? faker.internet.email(),
      password: override.password ?? faker.internet.password(),
      phone: override.phone ?? faker.phone.number(),
    },
    id,
  )
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: RecipientsMapper.toPersistent(recipient),
    })

    return recipient
  }
}
