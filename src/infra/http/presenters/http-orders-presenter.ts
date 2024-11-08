import { Order } from '@/domain/delivery/enterprise/entities/order'

export class HttpOrdersPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),

      recipientId: order.recipientId.toString(),

      deliveryManId: order.deliveryManId?.toString() ?? null,

      addressId: order.addressId.toString(),

      title: order.title,

      content: order.content,

      status: order.status,

      isRemovable: order.isRemovable,

      paymentMethod: order.paymentMethod,

      createdAt: order.createdAt,

      updatedAt: order.updatedAt ?? null,

      expectedDeliveryDate: order.expectedDeliveryDate,

      deliveryLatitude: order.deliveryLatitude,

      deliveryLongitude: order.deliveryLongitude,

      shipping: order.shipping,
    }
  }
}
