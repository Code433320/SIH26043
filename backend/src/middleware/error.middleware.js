// Centralized error handler. Registered LAST in app.js, after all routes.
// Any error passed to next(err) — including from asyncHandler — ends up here.
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    // Only log unexpected errors — expected 4xx errors (bad input, no auth)
    // don't need to clutter the server console.
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
