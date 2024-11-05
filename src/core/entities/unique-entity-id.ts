import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  // Define uma classe chamada UniqueEntityId para representar um identificador único para entidades.
  private value: string // Declara uma propriedade privada chamada value do tipo string que armazenará o UUID.

  constructor(value?: string) {
    // Construtor da classe, que aceita um valor opcional para o UUID.
    this.value = value ?? randomUUID() // Se um valor for fornecido, ele é usado; caso contrário, um UUID é gerado automaticamente.
  }

  toString() {
    // Método para retornar o UUID como uma string.
    return this.value // Retorna o valor armazenado em value.
  }

  toValue() {
    // Método para retornar o valor do UUID diretamente.
    return this.value // Retorna o valor armazenado em value.
  }

  equals(id: UniqueEntityId) {
    // Método para verificar se o UUID atual é igual ao UUID de outra instância UniqueEntityId.
    return id.toValue() === this.value // Compara o valor de value das duas instâncias e retorna true se forem iguais.
  }
}
