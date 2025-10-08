export const validateSchema =
  (schema, source = 'body') =>
  (req, res, next) => {
    const data = req[source]; // body, query, params, etc.
    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    // Guardamos los datos validados para usarlos en el controller
    req.validatedData = result.data;
    next();
  };
