import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { RecipientFactory } from 'test/factories/make-recipient-factory'

describe('Creatte Recipient E2E', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[POST] /authenticate-recipient', async () => {
    const plainPassword = '123456'
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash(plainPassword, 8),
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate-recipient')
      .send({
        cpf: recipient.cpf,
        password: plainPassword,
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
