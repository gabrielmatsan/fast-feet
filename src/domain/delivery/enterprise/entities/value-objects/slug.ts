import { ValueObject } from "@/core/entities/value-object";

export interface SlugProps {
  value: string;
}

export class Slug extends ValueObject<SlugProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SlugProps) {
    super(props);
  }

  // Método create que recebe diretamente uma string como valor
  static create(slug: string): Slug {
    return new Slug({ value: slug });
  }

  /**
   * Recebe uma string e normaliza para um slug.
   *
   * Exemplo: "Um título de exemplo" => "um-titulo-de-exemplo"
   *
   * @param text {string}
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // Substitui espaços por hífens
      .replace(/[^\w-]/g, '')       // Remove caracteres não permitidos
      .replace(/_/g, '-')           // Substitui sublinhados por hífens
      .replace(/--+/g, '-')         // Remove hífens duplos consecutivos
      .replace(/-$/g, '');          // Remove hífens no final

    return Slug.create(slugText);
  }
}