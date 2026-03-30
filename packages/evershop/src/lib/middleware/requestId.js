import { randomUUID } from 'crypto';

/**
 * Express middleware that generates a unique request ID per request.
 *
 * - Attaches the ID to `request.locals.requestId`
 * - Echoes it back via the `X-Request-ID` response header so clients
 *   can correlate requests with server-side logs.
 *
 * Uses Node's built-in `crypto.randomUUID()` (available since Node 14.17)
 * so no extra npm package is required.
 *
 * @param {import('express').Request}  request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
export default function requestId(request, response, next) {
  // Honour any upstream ID already set (e.g. by a load-balancer)
  const id =
    request.headers['x-request-id'] ||
    request.headers['x-correlation-id'] ||
    randomUUID();

  // Attach to request.locals so all downstream middleware can read it
  request.locals = request.locals || {};
  request.locals.requestId = id;

  // Expose it in the response so clients can match logs
  response.setHeader('X-Request-ID', id);

  next();
}
