import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface OrderProps {
  recipientId: UniqueEntityId
  deliveryManId?: UniqueEntityId | null
  addressId: UniqueEntityId

  status: OrderStatus
  isRemovable: boolean
  paymentMethod: string
  
  createdAt: Date
  updatedAt?: Date | null
  expectedDeliveryDate?: Date | null

  shipping: number
}

export type OrderStatus = 'pending' | 'awaiting' | 'inTransit' | 'delivered' | 'returned';


export class Order extends AggregateRoot<OrderProps> {
  static create(props: Optional<OrderProps, 'createdAt' | 'status' | 'deliveryManId'|'expectedDeliveryDate'>, id?: UniqueEntityId) {
    const order = new Order({...props,
      createdAt: new Date(),
      status: props.status ?? 'pending',
      deliveryManId: props.deliveryManId ?? null,
      expectedDeliveryDate: props.expectedDeliveryDate ?? null,
    },
     id)

    return order
  }

  get recipientId(){
    return this.props.recipientId
  }

  get deliveryManId(){
    return this.props.deliveryManId
  }

  get addressId(){
    return this.props.addressId
  }

  get paymentMethod(){
    return this.props.paymentMethod
  }

  get status(){
    return this.props.status
  }

  get isRemovable(){
    return this.props.isRemovable
  }

  set isRemovable(isRemovable: boolean){
    this.props.isRemovable = isRemovable
    this.touch()
  }

  get createdAt(){
    return this.props.createdAt
  }

  get updatedAt(){
    return this.props.updatedAt
  }

  get expectedDeliveryDate(){
    return this.props.expectedDeliveryDate ?? null
  }
  
  get shipping(){
    return this.props.shipping
  }

  private touch(){
    this.props.updatedAt = new Date()
  }

  markAsAwaiting() {
    this.props.status = 'awaiting';
    this.touch();
  }

  markAsInTransit() {
    this.props.status = 'inTransit';
    this.touch();
  }

  markAsDelivered() {
    this.props.status = 'delivered';
    this.touch();
  }

  markAsReturned() {
    this.props.status = 'returned';
    this.touch();
  }

  assignToDeliveryMan(deliveryManId: UniqueEntityId) {
    this.props.deliveryManId = deliveryManId;
    this.markAsInTransit();
  }

  set expectedDeliveryDate(date: Date | null) {
    this.props.expectedDeliveryDate = date;
    this.touch();
  }

}