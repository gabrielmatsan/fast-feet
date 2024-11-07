import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaDeliveryMensRepository } from './prisma/repositories/prisma-delivery-mens-repository'
import { AddressRepository } from '@/domain/delivery/application/repositories/address-repository'
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses-repository'

@Module({
  providers: [
    PrismaService,
    { provide: RecipientRepository, useClass: PrismaRecipientsRepository },
    { provide: DeliveryManRepository, useClass: PrismaDeliveryMensRepository },
    { provide: AddressRepository, useClass: PrismaAddressesRepository },
  ],
  exports: [
    PrismaService,
    RecipientRepository,
    DeliveryManRepository,
    AddressRepository,
  ],
})
export class DatabaseModule {}
