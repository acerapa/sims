const validateBody = (schema, abortEarly = true) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly,
    });
    if (error) {
      res.sendError({ error }, "Request Validation Error!", 401);
    } else {
      req.body.validated = value;
      next();
    }
  };
};

module.exports = {
  validateBody,
};
