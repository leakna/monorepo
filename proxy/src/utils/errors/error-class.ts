import { ERROR_MESSAGES } from "./error-message";
import { ERROR_STATUS_CODE } from "./status-code";

export class ProxyError extends Error {
  public readonly status: number;
  public errors?: {};

  constructor({
    message,
    status,
    errors,
  }: {
    message: string;
    status: number;
    errors?: {};
  }) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
export class NotFoundError extends ProxyError {
  constructor(message: string = ERROR_MESSAGES.client.notFound) {
    super({ message, status: ERROR_STATUS_CODE.client.notFound });
  }
}

export class AuthenticationError extends ProxyError {
  constructor(message: string = ERROR_MESSAGES.client.unauthorized) {
    super({ message, status: ERROR_STATUS_CODE.client.unauthorized });
  }
}
