import {
  OrderRepository,
  findManyNearbyParams,
} from '@/domain/delivery/application/repositories/order-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { OrdersMapper } from '../mappers/prisma-orders-mapper'
import { PrismaService } from '../prisma.service'
import { Order as PrismaOrder } from '@prisma/client'

@Injectable()
export class PrismaOrdersRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}
  async create(order: Order): Promise<void> {
    const data = OrdersMapper.toPersistent(order)

    await this.prisma.order.create({ data })
  }

  async update(order: Order): Promise<void> {
    const data = OrdersMapper.toPersistent(order)

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    })
  }

  async findByOrderId(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })
    if (!order) {
      return null
    }
    return OrdersMapper.toDomain(order)
  }

  async findManyNearby({
    latitude,
    longitude,
    maxDistance,
  }: findManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
    SELECT * FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${maxDistance} `

    return orders.map((order) => OrdersMapper.toDomain(order))
  }
}
