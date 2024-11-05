export class NeedAttachmentError extends Error {
  constructor(id: string) {
    super(`The order "${id}" need an attachment`)
  }
}
