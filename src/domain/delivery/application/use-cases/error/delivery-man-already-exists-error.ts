export class DeliveryManAlreadyExistsError extends Error {
  constructor(){
    super('Delivery man already exists')
  }
}