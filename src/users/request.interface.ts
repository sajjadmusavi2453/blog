import { Request as ExpressRequest } from 'express';
import { User } from 'src/types/types';

export interface Request extends ExpressRequest {
  user: User;
}
