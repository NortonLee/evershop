import { encode } from 'html-entities';
import AppError from '../../../../lib/error/AppError.js';
import { error } from '../../../../lib/log/logger.js';
import { INTERNAL_SERVER_ERROR } from '../../../../lib/util/httpStatus.js';
import isDevelopmentMode from '../../../../lib/util/isDevelopmentMode.js';

export default async (err, request, response, next) => {
  const isAppError = err instanceof AppError;

  if (isDevelopmentMode() || process.argv.includes('--debug')) {
    error(err);
  } else if (!isAppError) {
    // Unexpected server-side error — always log in production
    error(err);
  }

  // Set this flag to make sure this middleware only be executed 1 time
  response.locals.errorHandlerTriggered = true;

  // Check if the header is already sent or not.
  if (response.headersSent) {
    // TODO: Write a log message or next(error)?.
  } else if (request.currentRoute.isApi === true) {
    const statusCode = isAppError ? err.statusCode : INTERNAL_SERVER_ERROR;
    const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Something went wrong';
    const requestId = request.locals?.requestId ?? null;

    response.status(statusCode).json({
      data: null,
      error: {
        status: statusCode,
        code,
        message,
        requestId
      }
    });
  } else {
    const statusCode = isAppError ? err.statusCode : INTERNAL_SERVER_ERROR;
    response.status(statusCode).send(encode(err.message));
  }
};
