import { Request as ExpressRequest } from 'express';
import { Role } from 'src/enums/role';
export interface Request extends ExpressRequest {
  user: {
    id: string;
    role: Role;
    iat: number;
    exp: number;
  };
}
