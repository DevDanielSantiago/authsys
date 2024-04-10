import { Response } from 'express';
import mongoose from 'mongoose';

const handleValidationError = (
  error: mongoose.Error.ValidationError
): {
  [key: string]: string;
} => {
  return Object.keys(error.errors).reduce<{ [key: string]: string }>(
    (acc, key) => {
      acc[key] = error.errors[key].message;
      return acc;
    },
    {}
  );
};

const handleDuplicateKeyError = (error: any, res: Response): string => {
  return Object.keys(error.keyValue)[0];
};

export const handleError = (error: any, res: Response): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = handleValidationError(error);
    res.status(400).json({
      status: 400,
      message: 'One or more validation errors occurred.',
      errors,
    });
  } else if (error.code === 11000) {
    const field = handleDuplicateKeyError(error, res);
    res.status(400).json({
      status: 400,
      message: `The provided value for the ${field} field is already in use. Please choose a different value.`,
      errors: { [field]: 'duplicated' },
    });
  } else {
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error. Please try again later.',
      errors: { server: 'internalServerError' },
    });
  }
};
