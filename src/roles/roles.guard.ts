import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
      return requiredRoles.some((role) => user.roles?.includes(role));
    } catch (e) {
      throw new HttpException('Role error', HttpStatus.FORBIDDEN);
    }
  }
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const roles =
  //     this.reflector.getAllAndMerge<Role[]>('roles', [
  //       context.getClass(),
  //       context.getHandler(),
  //     ]) || [];

  //   // const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
  //   //   context.getHandler(),
  //   //   context.getClass(),
  //   // ]);

  //   // if (!roles || isPublic) {
  //   //   return true;
  //   // }
  //   if (!roles) {
  //     return true;
  //   }

  //   let isAllowed = false;
  //   console.log(context.switchToHttp().getRequest().request.user);
  //   console.log(roles);
  //   roles.forEach((role) => {
  //     if (context.switchToHttp().getRequest().request.user.role === role) {
  //       isAllowed = true;
  //     }
  //   });

  //   return isAllowed;
  // }
}
