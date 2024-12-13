import { SetMetadata } from "@nestjs/common";
import { Module, Permission } from "../role";

export const CHECK_PERMISSION_KEY = "check_permission"

export const CheckPermissions = (module: Module, permission: Permission) => SetMetadata(CHECK_PERMISSION_KEY, { module, permission })