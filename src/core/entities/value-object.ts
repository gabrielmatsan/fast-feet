export abstract class ValueObject<Props> { 

  protected props: Props; 
  // Define uma propriedade protegida chamada props do tipo Props.
  // Essa propriedade armazenará os valores encapsulados pelo objeto.

  protected constructor(props: Props) { 
    // Construtor protegido que aceita as propriedades do tipo Props.
    // Como o construtor é protegido, a classe não pode ser instanciada diretamente, apenas por subclasses.
    this.props = props; // Atribui o valor de props ao atributo de instância.
  }

  public equals(vo: ValueObject<unknown>) { 
    // Método público chamado equals que verifica se outro objeto ValueObject é igual ao atual.
    if (vo === this || vo === undefined) { 
      // Verifica se o objeto fornecido é a mesma instância (this) ou é indefinido.
      return false; // Retorna false se for a mesma instância ou indefinido.
    }

    if (vo.props === undefined) { 
      // Verifica se as propriedades do objeto comparado são indefinidas.
      return false; // Retorna false se as propriedades forem indefinidas.
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props); 
    // Compara as propriedades dos dois objetos convertendo-as para JSON e verificando se são iguais.
    // Retorna true se as propriedades são iguais, caso contrário, retorna false.
  }
}