import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { RecipientFactory } from 'test/factories/make-recipient-factory'
import { JwtService } from '@nestjs/jwt'

describe('Delete Recipient E2E', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /recipient', async () => {
    const plainPassword = '123456'

    // create recipient
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash(plainPassword, 8),
    })

    const accessToken = jwtService.sign({ sub: recipient.id.toString() })

    const response = await request(app.getHttpServer())
      .delete('/recipient')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: plainPassword,
      })

    expect(response.status).toBe(204)
  })
})
