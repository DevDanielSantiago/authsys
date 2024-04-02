type ErrorObject = { [key: string]: string };

export const validateAllowedFields = (fieldsInRequest: string[], allowedFields: string[]): ErrorObject => {
  return fieldsInRequest.reduce<ErrorObject>((acc, field) => {
    if (!allowedFields.includes(field)) {
      acc[field] = 'notAllowed';
    }
    return acc;
  }, {});
};