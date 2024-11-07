import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaDeliveryMensRepository } from './prisma/repositories/prisma-delivery-mens-repository'
import { AddressRepository } from '@/domain/delivery/application/repositories/address-repository'
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository'
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    { provide: RecipientRepository, useClass: PrismaRecipientsRepository },
    { provide: DeliveryManRepository, useClass: PrismaDeliveryMensRepository },
    { provide: AddressRepository, useClass: PrismaAddressesRepository },
    { provide: OrderRepository, useClass: PrismaOrdersRepository },
  ],
  exports: [
    PrismaService,
    RecipientRepository,
    DeliveryManRepository,
    AddressRepository,
    OrderRepository,
  ],
})
export class DatabaseModule {}
