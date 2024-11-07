import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import { RecipientsMapper } from '../mappers/prisma-recipients-mapper'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

@Injectable()
export class PrismaRecipientsRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = RecipientsMapper.toPersistent(recipient)

    await this.prisma.recipient.create({ data })
  }

  async update(recipient: Recipient): Promise<void> {
    const data = RecipientsMapper.toPersistent(recipient)

    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return RecipientsMapper.toDomain(recipient)
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        cpf,
      },
    })

    if (!recipient) {
      return null
    }

    return RecipientsMapper.toDomain(recipient)
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return RecipientsMapper.toDomain(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipient.id.toString(),
      },
    })
  }
}
