import { Either, left, right } from '@/core/either'
import { FyleTypeError } from './error/file-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Injectable } from '@nestjs/common'

interface UploadAndCreateAttachmentsRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentsResponse = Either<
  FyleTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private uploader: Uploader,
    private atttachmentRepository: AttachmentsRepository,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentsRequest): Promise<UploadAndCreateAttachmentsResponse> {
    // Valida o tipo do arquivo usando uma expressão regular (aceita apenas imagens JPEG, PNG e PDFs)
    if (!/^image\/(jpeg|png)$|^application\/pdf$/.test(fileType)) {
      // Retorna um erro se o tipo do arquivo for inválido
      return left(new FyleTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.atttachmentRepository.create(attachment)

    return right({ attachment })
  }
}
