import { Either, left, right } from '@/core/either'
import { HashCompare } from '../../criptography/hash-compare'
import { Encrypter } from '../../criptography/encrypter'
import { WrongCredentialsError } from './error/wrong-credentials-error'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { Injectable } from '@nestjs/common'

export interface AuthenticateDeliveryRequest {
  cpf: string
  password: string
}

type AuthenticateDeliveryResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateDeliveryUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashComparer: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryRequest): Promise<AuthenticateDeliveryResponse> {
    const deliveryMan = await this.deliveryManRepository.findByCpf(cpf)

    if (!deliveryMan) {
      return left(new WrongCredentialsError())
    }

    const passwordIsValid = await this.hashComparer.compare(
      password,
      deliveryMan.password,
    )

    if (!passwordIsValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryMan.id.toString(),
    })

    return right({ accessToken })
  }
}
