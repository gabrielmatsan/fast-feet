import { AcceptOrderUseCase } from '@/domain/delivery/application/use-cases/accept-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/orders/:id/accept')
export class AcceptOrderController {
  constructor(private acceptOrder: AcceptOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const deliveryManId = user.sub

    const result = await this.acceptOrder.execute({ orderId, deliveryManId })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
