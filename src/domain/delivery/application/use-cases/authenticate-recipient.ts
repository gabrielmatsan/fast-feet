import { Either, left, right } from '@/core/either'
import { RecipientRepository } from '../repositories/recipient-repository'
import { HashCompare } from '../../criptography/hash-compare'
import { Encrypter } from '../../criptography/encrypter'
import { WrongCredentialsError } from './error/wrong-credentials-error'

export interface AuthenticateRecipientRequest {
  cpf: string
  password: string
}

type AuthenticateRecipientResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private hashComparer: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateRecipientRequest): Promise<AuthenticateRecipientResponse> {
    const recipient = await this.recipientRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new WrongCredentialsError())
    }

    const passwordIsValid = await this.hashComparer.compare(
      password,
      recipient.password,
    )

    if (!passwordIsValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id.toString(),
    })

    return right({ accessToken })
  }
}
