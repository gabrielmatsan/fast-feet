import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { DeliveryManFactory } from 'test/factories/make-delivery-man-factory'

describe('Authenticate Delivery Man E2E', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[POST] /authenticate-delivery-man', async () => {
    const plainPassword = '123456'
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password: await hash(plainPassword, 8),
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate-delivery-man')
      .send({
        cpf: deliveryMan.cpf,
        password: plainPassword,
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
