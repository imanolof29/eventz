import { UseGuards, applyDecorators } from "@nestjs/common";
import { UserRole } from "src/users/user.entity";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";

export function Auth(...roles: UserRole[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    )
}