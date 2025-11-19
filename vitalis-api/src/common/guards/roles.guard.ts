import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

/**
 * Role-Based Access Control (RBAC) Guard
 * Enforces role requirements on protected endpoints
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Ensure user exists and has a role
    if (!user || !user.role) {
      this.logger.warn(`Access denied - User: ${user?.email || 'unknown'}, Required roles: ${requiredRoles.join(', ')}`);
      return false;
    }

    // Check if user's role is in the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      this.logger.warn(`Access denied - User ${user.email} (${user.role}) attempted to access endpoint requiring: ${requiredRoles.join(', ')}`);
    }
    return hasRole;
  }
}

