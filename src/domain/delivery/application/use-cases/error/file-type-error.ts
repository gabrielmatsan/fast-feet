export class FyleTypeError extends Error {
  constructor(type: string) {
    super(`The file type "${type}" is invalid`)
  }
}
