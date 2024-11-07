import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/error/wrong-credentials-error'
import { AuthenticateDeliveryUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-man'

const authenticateDeliveryManBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateDeliveryManBodySchema = z.infer<
  typeof authenticateDeliveryManBodySchema
>

@Controller('/authenticate-delivery-man')
@Public()
export class AuthenticateDeliveryManController {
  constructor(private authenticateDeliveryMan: AuthenticateDeliveryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateDeliveryManBodySchema))
  async handle(@Body() body: AuthenticateDeliveryManBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateDeliveryMan.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
