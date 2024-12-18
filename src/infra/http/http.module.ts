import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../criptography/criptography.module'
import { StorageModule } from '../storage/storage.module'

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
import { DeleteRecipientController } from './controllers/recipient/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient'
import { EditAddressController } from './controllers/address/edit-address.controller'
import { EditAddressUseCase } from '@/domain/delivery/application/use-cases/edit-address'
import { ReadyToPickUpController } from './controllers/order/ready-to-pick-up.controller'
import { ReadyToPickUpUseCase } from '@/domain/delivery/application/use-cases/ready-to-pick-up'
import { AcceptOrderController } from './controllers/delivery-man/accept-order.controller'
import { AcceptOrderUseCase } from '@/domain/delivery/application/use-cases/accept-order'
import { FetchNearbyOrdersController } from './controllers/delivery-man/fetch-nearby-orders.controller'
import { FetchNearbyOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders'
import { OrderReturnedController } from './controllers/order/order-returned.controller'
import { OrderReturnedUseCase } from '@/domain/delivery/application/use-cases/order-returned'
import { OrderInTransitController } from './controllers/order/order-in-transit.controller'
import { OrderTransitUseCase } from '@/domain/delivery/application/use-cases/order-in-transit'
import { UploadAndCreateAttachmentController } from './controllers/attachments/upload-and-create-attachment.controller'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/delivery/application/use-cases/upload-and-create-attachment'
import { OrderDeliveredController } from './controllers/order/order-delivered.controller'
import { OrderDeliveredUseCase } from '@/domain/delivery/application/use-cases/order-delivered'
import { ReadNotificationController } from './controllers/recipient/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateRecipientController,
    AuthenticateRecipientController,
    CreateAddressController,
    CreateOrderController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
    DeleteDeliveryManController,
    DeleteRecipientController,
    EditAddressController,
    ReadyToPickUpController,
    AcceptOrderController,
    FetchNearbyOrdersController,
    OrderReturnedController,
    OrderInTransitController,
    UploadAndCreateAttachmentController,
    OrderDeliveredController,
    ReadNotificationController,
  ],
  providers: [
    CreateRecipientUseCase,
    AuthenticateRecipientUseCase,
    CreateAddressUseCase,
    CreateOrderUseCase,
    CreateDeliveryManUseCase,
    AuthenticateDeliveryUseCase,
    DeleteDeliveryManUseCase,
    DeleteRecipientUseCase,
    EditAddressUseCase,
    ReadyToPickUpUseCase,
    AcceptOrderUseCase,
    FetchNearbyOrdersUseCase,
    OrderReturnedUseCase,
    OrderTransitUseCase,
    UploadAndCreateAttachmentsUseCase,
    OrderDeliveredUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
