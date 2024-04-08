import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res
      .status(400)
      .send({ status: 400, errors: { body: 'malFormatted' } });
  }
  return res
    .status(500)
    .send({ status: 500, errors: { server: 'internalServerError' } });
};

export default errorHandler;
