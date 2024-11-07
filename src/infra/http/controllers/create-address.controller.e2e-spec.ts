import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient-factory'
import { JwtService } from '@nestjs/jwt'
import { CreateAddressUseCase } from '@/domain/delivery/application/use-cases/create-address'
import { hash } from 'bcryptjs'

describe('CreateAddressController (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, CreateAddressUseCase],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /addresses - authenticated access', async () => {
    const plainPassword = '123456'
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash(plainPassword, 8),
    })

    const accessToken = jwtService.sign({ sub: recipient.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/addresses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        street: '123 Example Street',
        number: '456',
        zipcode: '12345-678',
        city: 'Example City',
        state: 'EX',
        complement: 'Apt 789',
        neighborhood: 'Example Neighborhood',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    console.log(response.body)

    // Verify that the response has the correct status and structure
    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      message: 'Endereço criado com sucesso',
    })
  })

  test('[POST] /addresses - unauthorized access', async () => {
    // Send a request without an Authorization header
    const response = await request(app.getHttpServer())
      .post('/addresses')
      .send({
        street: '123 Example Street',
        number: '456',
        zipcode: '12345-678',
        city: 'Example City',
        state: 'EX',
        complement: 'Apt 789',
        neighborhood: 'Example Neighborhood',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    // Verify that the response is unauthorized
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Unauthorized')
  })
})
