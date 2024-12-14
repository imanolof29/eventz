import { SetMetadata } from "@nestjs/common";

export const CHECK_PERMISSION_KEY = 'check_permission';

export const CheckPermissions = (module: string, permission: string) => SetMetadata(CHECK_PERMISSION_KEY, { module, permission });