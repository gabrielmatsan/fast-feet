import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/create-recipient'
import { CryptographyModule } from '../criptography/criptography.module'
import { AuthenticateRecipientController } from './controllers/authenticate-recipient.controller'
import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient'
import { CreateAddressController } from './controllers/create-address.controller'
import { CreateAddressUseCase } from '@/domain/delivery/application/use-cases/create-address'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateRecipientController,
    AuthenticateRecipientController,
    CreateAddressController,
  ],
  providers: [
    CreateRecipientUseCase,
    AuthenticateRecipientUseCase,
    CreateAddressUseCase,
  ],
})
export class HttpModule {}
