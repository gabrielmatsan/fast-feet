import { Either, left, right } from '@/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { RecipientAlreadyExistsError } from './error/recipient-already-exists-error'
import { HashGenerator } from '../../criptography/hash-generator'
import { Injectable } from '@nestjs/common'

export interface CreateRecipientRequest {
  name: string
  cpf: string
  email: string
  password: string
  phone: string
}

type CreateRecipientResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
    phone,
  }: CreateRecipientRequest): Promise<CreateRecipientResponse> {
    const isCpfAlreadyExists = await this.recipientRepository.findByCpf(cpf)

    if (isCpfAlreadyExists) {
      return left(new RecipientAlreadyExistsError())
    }

    const isEmailAlreadyExists =
      await this.recipientRepository.findByEmail(email)

    if (isEmailAlreadyExists) {
      return left(new RecipientAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const recipient = Recipient.create({
      name,
      cpf,
      email,
      phone,
      password: hashedPassword,
    })

    await this.recipientRepository.create(recipient)

    return right({ recipient })
  }
}
