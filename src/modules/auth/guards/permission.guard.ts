import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission, Module, ROLE_PERMISSIONS } from "../role";
import { CHECK_PERMISSION_KEY } from "../decorators/permission.decorator";
import { User } from "src/modules/users/user.entity";

@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const { module, permission } = this.reflector.getAllAndOverride<{ module: Module; permission: Permission }>(
            CHECK_PERMISSION_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!module || !permission) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as User;

        if (!user || !user.role) {
            throw new ForbiddenException('User role is not defined');
        }

        const userPermissions = ROLE_PERMISSIONS[user.role]?.[module] || [];

        if (!userPermissions.includes(permission)) {
            throw new ForbiddenException('User does not have required permissions');
        }

        return true;
    }

}