import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../criptography/criptography.module'
import { CreateRecipientController } from './controllers/recipient/create-recipient.controller'
import { AuthenticateRecipientController } from './controllers/recipient/authenticate-recipient.controller'
import { CreateAddressController } from './controllers/address/create-address.controller'
import { CreateOrderController } from './controllers/order/create-order.controller'
import { CreateDeliveryManController } from './controllers/delivery-man/create-delivery-man.controller'
import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/create-recipient'
import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient'
import { CreateAddressUseCase } from '@/domain/delivery/application/use-cases/create-address'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { CreateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/create-delivery-man'
import { AuthenticateDeliveryManController } from './controllers/delivery-man/authenticate-delivery-man.controller'
import { AuthenticateDeliveryUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-man'
import { DeleteDeliveryManController } from './controllers/delivery-man/delete-delivery-man.controller'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delete-delivery-man'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateRecipientController,
    AuthenticateRecipientController,
    CreateAddressController,
    CreateOrderController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
    DeleteDeliveryManController,
  ],
  providers: [
    CreateRecipientUseCase,
    AuthenticateRecipientUseCase,
    CreateAddressUseCase,
    CreateOrderUseCase,
    CreateDeliveryManUseCase,
    AuthenticateDeliveryUseCase,
    DeleteDeliveryManUseCase,
  ],
})
export class HttpModule {}
