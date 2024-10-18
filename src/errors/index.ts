import { ValidationError } from 'class-validator';

export const generateError = (
  statusCode: number,
  errors: ValidationError[],
) => {
  const mapError = errors.flatMap((err) => Object.values(err.constraints));

  return {
    message: mapError,
    error: generateMessage(statusCode),
    statusCode,
  };
};
export const generateMessage = (statusCode:number) => {
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
