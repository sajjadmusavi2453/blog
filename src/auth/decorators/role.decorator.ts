import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role';

export const ROLE_KEY = 'role';

export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLE_KEY, roles);
