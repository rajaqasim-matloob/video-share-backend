// src/shared/decorators/role.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/enums/enum';

export const Role = (role: UserRole) => SetMetadata('role', role);
