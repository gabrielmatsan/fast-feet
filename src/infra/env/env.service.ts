import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Injectable()
export class EnvService {
  // Injeta o ConfigService no construtor, tipando-o como ConfigService<Env, true>
  constructor(private configService: ConfigService<Env, true>) {}

  /**
   * Método genérico `get` para acessar variáveis de ambiente de forma tipada.
   * @param key - A chave da variável de ambiente que queremos acessar, deve ser uma chave válida de Env.
   * @returns O valor da variável de ambiente especificada por `key`, com o tipo inferido automaticamente.
   */
  get<T extends keyof Env>(key: T) {
    // Usa o ConfigService para obter o valor da variável de ambiente e infere automaticamente o tipo do retorno.
    return this.configService.get(key, { infer: true })
  }
}
