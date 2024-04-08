import { Response } from 'express';
import mongoose from 'mongoose';

const handleValidationError = (error: mongoose.Error.ValidationError, res: Response): void => {
  const errors = Object.keys(error.errors).reduce<{ [key: string]: string }>((acc, key) => {
    acc[key] = error.errors[key].message;
    return acc;
  }, {});

  res.status(400).json({ status: 400, errors });
};

const handleDuplicateKeyError = (error: any, res: Response): void => {
    const field = Object.keys(error.keyValue)[0];
    res.status(400).json({ status: 400, errors: { [field]: 'duplicated' } });
  };

export const handleError = (error: any, res: Response): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    handleValidationError(error as mongoose.Error.ValidationError, res);
  } else if (error.code === 11000) {
    handleDuplicateKeyError(error, res);
  } else {
    res.status(500).send({ status: 500, errors: { server: 'internalServerError' }});
  }
};