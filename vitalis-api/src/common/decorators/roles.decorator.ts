import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Roles decorator for RBAC
 * Usage: @Roles(Role.ADMIN, Role.VETERINARIAN)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

