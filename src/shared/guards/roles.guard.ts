import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/shared/enums/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>('role', context.getHandler());
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.role === requiredRole;
  }
}