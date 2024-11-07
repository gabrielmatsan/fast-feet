import { AuthenticateRecipientUseCase } from '@/domain/delivery/application/use-cases/authenticate-recipient'
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
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/error/wrong-credentials-error'

const authenticateRecipientBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateRecipientBodySchema = z.infer<
  typeof authenticateRecipientBodySchema
>

@Controller('/authenticate-recipient')
@Public()
export class AuthenticateRecipientController {
  constructor(private authenticateRecipient: AuthenticateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateRecipientBodySchema))
  async handle(@Body() body: AuthenticateRecipientBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateRecipient.execute({
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
