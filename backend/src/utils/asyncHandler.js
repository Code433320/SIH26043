// Wraps an async controller so any thrown error / rejected promise
// is forwarded to Express's error-handling middleware, instead of
// crashing the process or leaving the request hanging.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};