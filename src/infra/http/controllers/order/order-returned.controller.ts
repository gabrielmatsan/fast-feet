import { OrderReturnedUseCase } from '@/domain/delivery/application/use-cases/order-returned'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  HttpCode,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common'

@Controller('/orders/:id/returned')
export class OrderReturnedController {
  constructor(private orderReturned: OrderReturnedUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const deliveryManId = user.sub

    const result = await this.orderReturned.execute({ orderId, deliveryManId })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
