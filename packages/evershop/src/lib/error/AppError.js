import {
  INVALID_PAYLOAD,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR
} from '../util/httpStatus.js';

/**
 * Custom application error that carries an HTTP status code,
 * a machine-readable error code string, and optional metadata.
 */
export default class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message.
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500).
   * @param {string} code - Machine-readable error code (e.g. 'BAD_REQUEST').
   * @param {object} [metadata] - Optional extra context for debugging / logging.
   */
  constructor(message, statusCode, code, metadata = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.metadata = metadata;

    // Capture a proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  // ─── Static factory methods ───────────────────────────────────────────────

  /**
   * 400 Bad Request
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static badRequest(message = 'Bad Request', metadata = {}) {
    return new AppError(message, INVALID_PAYLOAD, 'BAD_REQUEST', metadata);
  }

  /**
   * 401 Unauthorized
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static unauthorized(message = 'Unauthorized', metadata = {}) {
    return new AppError(message, UNAUTHORIZED, 'UNAUTHORIZED', metadata);
  }

  /**
   * 403 Forbidden
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static forbidden(message = 'Forbidden', metadata = {}) {
    return new AppError(message, FORBIDDEN, 'FORBIDDEN', metadata);
  }

  /**
   * 404 Not Found
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static notFound(message = 'Not Found', metadata = {}) {
    return new AppError(message, NOT_FOUND, 'NOT_FOUND', metadata);
  }

  /**
   * 409 Conflict
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static conflict(message = 'Conflict', metadata = {}) {
    return new AppError(message, CONFLICT, 'CONFLICT', metadata);
  }

  /**
   * 500 Internal Server Error
   * @param {string} [message]
   * @param {object} [metadata]
   */
  static internal(message = 'Internal Server Error', metadata = {}) {
    return new AppError(
      message,
      INTERNAL_SERVER_ERROR,
      'INTERNAL_SERVER_ERROR',
      metadata
    );
  }
}
