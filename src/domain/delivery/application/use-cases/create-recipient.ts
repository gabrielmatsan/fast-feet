import { Either, left, right } from "@/core/either"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientRepository } from "../repositories/recipient-repository"
import { RecipientAlreadyExistsError } from "./error/recipient-already-exists-error"

export interface CreateRecipientRequest {
  name: string
  cpf: string
  email: string
  password: string
  phone: string
}

type CreateRecipientResponse = Either<RecipientAlreadyExistsError,{
  recipient: Recipient
}>

export class CreateRecipientUseCase{

  constructor(private recipientRepository: RecipientRepository){}

  async execute({name,cpf,email,password,phone}:CreateRecipientRequest): Promise<CreateRecipientResponse>{
    const isCpfAlreadyExists = await this.recipientRepository.findByCpf(cpf)

    if(isCpfAlreadyExists){
      return left(new RecipientAlreadyExistsError())
    }

    const isEmailAlreadyExists = await this.recipientRepository.findByEmail(email)

    if(isEmailAlreadyExists){
      return left(new RecipientAlreadyExistsError())
    }

    const recipient = Recipient.create({
      name,
      cpf,
      email,
      phone,
      password
    })

    return right({recipient})
  } 
}