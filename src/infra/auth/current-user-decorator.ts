import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './jwt-strategy'

// Criando decorator para pegar o usuário
export const CurrentUser = createParamDecorator(
  // O primeiro parâmetro (_) é ignorado (pois não é necessário neste caso).
  // O segundo parâmetro (context) fornece o contexto de execução da requisição HTTP.
  (_never, context: ExecutionContext) => {
    // Obtém o objeto request (solicitação HTTP) a partir do contexto de execução
    const request = context.switchToHttp().getRequest()
    // Retorna o usuário anexado ao request, que foi provavelmente adicionado pelo middleware de autenticação JWT.
    // O tipo é garantido como UserPayload, que vem do arquivo 'jwt.strategy'.
    return request.user as UserPayload
  },
)
