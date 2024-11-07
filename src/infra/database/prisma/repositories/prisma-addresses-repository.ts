import { AddressRepository } from '@/domain/delivery/application/repositories/address-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Address } from '@/domain/delivery/enterprise/entities/address'
import { AddressesMapper } from '../mappers/prisma-addresses-mapper'

@Injectable()
export class PrismaAddressesRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const data = AddressesMapper.toPersistent(address)

    await this.prisma.address.create({ data })
  }

  async update(address: Address): Promise<void> {
    const data = AddressesMapper.toPersistent(address)

    await this.prisma.address.update({
      where: {
        id: address.id.toString(),
      },
      data,
    })
  }

  async delete(address: Address): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id: address.id.toString(),
      },
    })
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    })

    if (!address) {
      return null
    }

    return AddressesMapper.toDomain(address)
  }

  async findByRecipientId(recipientId: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        recipientId,
      },
    })

    if (!address) {
      return null
    }

    return AddressesMapper.toDomain(address)
  }
}
