import AppError from '../utils/AppError.js';

// Validates req.body against a zod schema and replaces it with the parsed
// (trimmed / coerced) value, so controllers only ever see clean input.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const field = issue.path.join('.');
      // zod's default "Required" isn't very helpful on its own
      const message = issue.message === 'Required' ? `${field || 'value'} is required` : issue.message;
      return { field, message };
    });
    const err = new AppError(errors[0]?.message || 'Invalid request data', 400);
    err.errors = errors;
    return next(err);
  }

  req.body = result.data;
  next();
};

export default validate;
