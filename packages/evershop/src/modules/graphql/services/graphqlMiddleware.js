import { execute, parse, validateSchema } from 'graphql';
import AppError from '../../../lib/error/AppError.js';
import { OK } from '../../../lib/util/httpStatus.js';
import { getContext } from './contextHelper.js';

/**
 * Maps a GraphQLError to an AppError so the global error handler can set
 * the correct HTTP status code instead of defaulting every GraphQL error to 500.
 *
 * Resolution order:
 *  1. `extensions.code`    – well-known string codes set by resolvers
 *  2. `extensions.statusCode` – numeric HTTP status code set by resolvers
 *  3. Fallback – return the original GraphQLError unchanged (backward-compatible,
 *     the error handler will treat it as 500 Internal Server Error)
 *
 * @param {import('graphql').GraphQLError} graphqlError
 * @returns {AppError|import('graphql').GraphQLError}
 */
function graphqlErrorToAppError(graphqlError) {
  const message = graphqlError.message;
  const extensions = graphqlError.extensions ?? {};
  const { code, statusCode } = extensions;

  // ── 1. Map well-known string error codes ─────────────────────────────────
  if (typeof code === 'string') {
    switch (code.toUpperCase()) {
      case 'UNAUTHENTICATED':
      case 'UNAUTHORIZED':
        return AppError.unauthorized(message);
      case 'FORBIDDEN':
        return AppError.forbidden(message);
      case 'NOT_FOUND':
        return AppError.notFound(message);
      case 'BAD_USER_INPUT':
      case 'VALIDATION_FAILED':
        return AppError.badRequest(message);
      case 'CONFLICT':
        return AppError.conflict(message);
      case 'INTERNAL_SERVER_ERROR':
        return AppError.internal(message);
      default:
        break;
    }
  }

  // ── 2. Map numeric HTTP status codes ─────────────────────────────────────
  if (typeof statusCode === 'number') {
    switch (statusCode) {
      case 400:
        return AppError.badRequest(message);
      case 401:
        return AppError.unauthorized(message);
      case 403:
        return AppError.forbidden(message);
      case 404:
        return AppError.notFound(message);
      case 409:
        return AppError.conflict(message);
      case 500:
        return AppError.internal(message);
      default:
        break;
    }
  }

  // ── 3. Backward-compatible fallback ──────────────────────────────────────
  // No recognised code/statusCode — return the original GraphQLError so the
  // error handler falls back to 500, preserving the previous behaviour.
  return graphqlError;
}

export const graphqlMiddleware = (schema) =>
  async function graphqlMiddleware(request, response, next) {
    const { body } = request;
    const { query, variables } = body;
    try {
      if (!query) {
        response.status(OK).json({
          data: {}
        });
        return;
      }

      const document = parse(query);
      // Validate the query
      const validationErrors = validateSchema(schema, document);
      if (validationErrors.length > 0) {
        next(new Error(validationErrors[0].message));
      } else {
        const data = await execute({
          schema,
          contextValue: getContext(request),
          document,
          variableValues: variables
        });
        if (data.errors) {
          // Map the first GraphQL error to the appropriate AppError so the
          // global error handler can respond with the correct HTTP status code.
          next(graphqlErrorToAppError(data.errors[0]));
        } else {
          response.status(OK).json({
            data: data.data
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };
