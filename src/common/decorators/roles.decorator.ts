import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * Restricts endpoint access to specified roles.
 * Usage: @Roles('ADMIN') or @Roles('VENDOR', 'ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
