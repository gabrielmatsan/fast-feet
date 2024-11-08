import { BadRequestException, type PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Validation failed in ZodValidationPipe:', error.errors) // Depuração
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          error: fromZodError(error),
        })
      }
    }
  }
}

/* import { BadRequestException, type PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    console.log('Received value in ZodValidationPipe:', value); // Log para depuração
    try {
      const parsedValue = this.schema.parse(value as Record<string, any>);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Validation failed in ZodValidationPipe:', error.errors); // Detalhes do erro
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          error: fromZodError(error),
        });
      }
    }
  }
} */
