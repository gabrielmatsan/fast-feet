import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// Criação de um evento de domínio customizado que implementa a interface DomainEvent.
class CustomAggregateCreate implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  // Construtor que inicializa o evento e atribui o agregado relacionado ao evento.
  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date() // Define a data e hora em que o evento ocorreu.
  }

  // Método que retorna o ID do agregado relacionado a este evento.
  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

// Classe CustomAggregate que herda de AggregateRoot e usa eventos de domínio.
class CustomAggregate extends AggregateRoot<null> {
  // Método estático para criar uma nova instância de CustomAggregate e registrar um evento de domínio.
  static create() {
    const aggregate = new CustomAggregate(null)

    // Adiciona um evento de domínio ao criar o agregado.
    aggregate.addDomainEvent(new CustomAggregateCreate(aggregate))

    return aggregate
  }
}

// Teste para verificar o funcionamento do mecanismo de eventos de domínio.
describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    // Cria um spy que será chamado quando o evento for disparado.
    const callbackSpy = vi.fn()

    // Registra o callbackSpy como ouvinte do evento CustomAggregateCreate.
    DomainEvents.register(callbackSpy, CustomAggregateCreate.name)

    // Cria uma nova instância de CustomAggregate. O evento é criado, mas ainda não disparado.
    const aggregate = CustomAggregate.create()

    // Verifica que o evento foi adicionado à lista de eventos do agregado, mas ainda não disparado.
    expect(aggregate.domainEvents).toHaveLength(1)

    // Dispara os eventos do agregado. O callbackSpy deverá ser chamado.
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Verifica se o callbackSpy foi chamado em resposta ao evento.
    expect(callbackSpy).toHaveBeenCalled()

    // Verifica que a lista de eventos do agregado foi limpa após o disparo.
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})