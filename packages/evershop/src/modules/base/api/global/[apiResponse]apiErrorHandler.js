import AppError from '../../../../lib/error/AppError.js';
import { error } from '../../../../lib/log/logger.js';
import { INTERNAL_SERVER_ERROR } from '../../../../lib/util/httpStatus.js';
import isDevelopmentMode from '../../../../lib/util/isDevelopmentMode.js';

export default async (err, request, response, next) => {
  // Always log errors; in production only non-AppErrors (unexpected failures)
  // are logged at the error level to avoid flooding the logs with client errors.
  const isAppError = err instanceof AppError;

  if (isDevelopmentMode() || process.argv.includes('--debug')) {
    error(err);
  } else if (!isAppError) {
    // Unexpected server-side error — log it even in production
    error(err);
  }

  // Check if the header is already sent or not.
  if (response.headersSent) {
    // TODO: Write a log message or next(error)?.
  } else {
    const statusCode = isAppError ? err.statusCode : INTERNAL_SERVER_ERROR;
    const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Something went wrong';
    const requestId = request.locals?.requestId ?? null;

    response.status(statusCode).json({
      error: {
        status: statusCode,
        code,
        message,
        requestId
      }
    });
  }
};
