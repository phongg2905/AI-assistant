import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ statusCode: status, message, error: 'DomainError' }, status);
  }
}

export class ProductNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Product with ID "${id}" was not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidConstraintException extends DomainException {
  constructor(message: string) {
    super(`Invalid constraint: ${message}`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
