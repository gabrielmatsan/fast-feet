import { EditAddressUseCase } from '@/domain/delivery/application/use-cases/edit-address'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const editAddressBodySchema = z.object({
  street: z.string(),
  number: z.string(),
  zipcode: z.string(),
  city: z.string(),
  state: z.string(),
  complement: z.string(),
  neighborhood: z.string(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type EditAddressBodySchema = z.infer<typeof editAddressBodySchema>

@Controller('/address/:id')
export class EditAddressController {
  constructor(private editAddress: EditAddressUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAddressBodySchema))
    body: EditAddressBodySchema,
    @Param('id') addressId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      street,
      number,
      zipcode,
      city,
      state,
      complement,
      neighborhood,
      latitude,
      longitude,
    } = body

    const recipientId = user.sub

    const result = await this.editAddress.execute({
      addressId,
      recipientId,
      street,
      number,
      zipcode,
      city,
      state,
      complement,
      neighborhood,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
