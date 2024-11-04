import { Order } from "@/domain/delivery/enterprise/entities/order"
import { DeliveryMan } from "@/domain/delivery/enterprise/entities/delivery-man"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { makeDeliveryMan } from "test/factories/make-delivery-man-factory"
import { makeOrder } from "test/factories/make-order-factory"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryDeliveryManRepository } from "test/repositories/in-memory-delivery-man-repository"
import { FetchNearbyOrdersUseCase } from "./fetch-nearby-orders"

describe("Fetch Nearby Orders UseCase", () => {
  let orderRepository: InMemoryOrderRepository
  let deliveryManRepository: InMemoryDeliveryManRepository
  let sut: FetchNearbyOrdersUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    deliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new FetchNearbyOrdersUseCase(orderRepository, deliveryManRepository)
  })

  it("should be returning nearby orders", async () => {
    const order1 = makeOrder({
      deliveryLatitude:1.4483454,
      deliveryLongitude:-48.4835328
    })
    const order2 = makeOrder({
      deliveryLatitude:60.4483454,
      deliveryLongitude:-60.4835328
    })

    await orderRepository.create(order1)
    await orderRepository.create(order2)

    const deliveryMan = makeDeliveryMan({
      deliveryManLatitude: order1.deliveryLatitude,
      deliveryManLongitude: order1.deliveryLongitude
    })
    await deliveryManRepository.create(deliveryMan)

    // Executa o caso de uso
    const response = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      deliveryManlatitude: deliveryMan.deliveryManLatitude,
      deliveryManlongitude: deliveryMan.deliveryManLongitude,
      maxDistance: 100
    })

    // Verifica o resultado
    expect(response.isRight()).toBe(true)
    expect((response.value as { orders: Order[] }).orders).toHaveLength(1)
  })
})