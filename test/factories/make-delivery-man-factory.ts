import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DeliveryMan, DeliveryManProps } from '@/domain/delivery/enterprise/entities/delivery-man';
import {faker} from '@faker-js/faker'

export function makeDeliveryMan(override: Partial<DeliveryManProps> = {}, id?: UniqueEntityId) {
  return DeliveryMan.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? faker.string.numeric(11),
      password: override.password ?? faker.internet.password(),
      phone: override.phone ?? faker.phone.number(),
      deliveryManLatitude: override.deliveryManLatitude ?? faker.location.latitude(),
      deliveryManLongitude: override.deliveryManLongitude ?? faker.location.longitude(),
    },
    id,
  );
}
