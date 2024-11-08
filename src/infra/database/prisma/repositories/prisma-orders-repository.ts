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
    deliveryLatitude,
    deliveryLongitude,
    maxDistance,
  }: findManyNearbyParams): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * FROM orders
      WHERE ( 6371 * acos( cos( radians(${deliveryLatitude}) ) * cos( radians( delivery_longitude ) ) 
      * cos( radians( delivery_latitude ) - radians(${deliveryLongitude}) ) 
      + sin( radians(${deliveryLatitude}) ) * sin( radians( delivery_latitude ) ) ) ) <= ${maxDistance} `

    return orders.map((order) => OrdersMapper.toDomain(order))
  }
}
