
import { NextFunction, Request, Response } from "express";
import { ProxyError } from "../utils/errors/error-class";
import { ERROR_STATUS_CODE } from "../utils/errors/status-code";
import {ERROR_MESSAGES } from "../utils/errors/error-message";


export function globalErrorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  // Handle Error
  if (error instanceof ProxyError) {
    const status = error.status;
    const message = error.message;
    const errors = error.errors;

    console.error(`$Proxy - globalErrorHandler() method error: ${error}`)
    return res.status(status).json({ message, error: errors })
  }

  // Unhandle Error
  console.error(`$UserService - globalErrorHandler() method unexpected error: ${error}`)
  res.status(ERROR_STATUS_CODE.server.internalError).json({ message: ERROR_MESSAGES.server.serverError})
}