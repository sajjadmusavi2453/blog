import { ValidationError } from 'class-validator';

export const generateError = (statusCode: number, errors: ValidationError) => {
  const [message, messageVal] = Object.entries(errors.constraints)[0];

  return {
    message: messageVal,
    error: generateMessage(statusCode),
    statusCode,
    field: errors.property,
  };
};
export const generateMessage = (statusCode) => {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    default:
      return 'Bad Request';
  }
};
