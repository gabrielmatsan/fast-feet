import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import { DeliveryMensMapper } from '../mappers/prisma-delivery-mens-mapper'

@Injectable()
export class PrismaDeliveryMensRepository implements DeliveryManRepository {
  constructor(private prisma: PrismaService) {}
  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = DeliveryMensMapper.toPersistent(deliveryMan)

    await this.prisma.deliveryMan.create({ data })
  }

  async update(deliveryMan: DeliveryMan): Promise<void> {
    const data = DeliveryMensMapper.toPersistent(deliveryMan)

    await this.prisma.deliveryMan.update({
      where: {
        id: deliveryMan.id.toString(),
      },
      data,
    })
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    await this.prisma.deliveryMan.delete({
      where: {
        id: deliveryMan.id.toString(),
      },
    })
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.deliveryMan.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return DeliveryMensMapper.toDomain(deliveryMan)
  }

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.deliveryMan.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return DeliveryMensMapper.toDomain(deliveryMan)
  }
}
