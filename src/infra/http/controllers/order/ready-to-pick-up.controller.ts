import { ReadyToPickUpUseCase } from '@/domain/delivery/application/use-cases/ready-to-pick-up'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  HttpCode,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common'

@Controller('/orders/:id/ready-to-pick-up')
export class ReadyToPickUpController {
  constructor(private readyToPickUp: ReadyToPickUpUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const recipientId = user.sub

    const result = await this.readyToPickUp.execute({ orderId, recipientId })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
