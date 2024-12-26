import { UserRole } from "../users/user.entity"

export const PERMISSIONS = {
    list: 'list',
    detail: 'detail',
    edit: 'edit',
    add: 'add',
    delete: 'delete'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const MODULES = {
    categories: 'categories',
    comments: 'comments',
    events: 'events',
    places: 'places',
    purchases: 'purchases',
    users: 'users',
    organizations: 'organization'
}

export type Module = (typeof MODULES)[keyof typeof MODULES]

export const ROLE_PERMISSIONS: { [key in UserRole]: { [key in Module]?: Permission[] } } =
    {
        [UserRole.ADMIN]: {
            [MODULES.categories]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.comments]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.organizations]: [
                PERMISSIONS.list,
                PERMISSIONS.add,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.delete,
            ],
            [MODULES.events]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.places]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.purchases]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.users]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ]
        },
        [UserRole.ORGANIZER]: {
            [MODULES.categories]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
            ],
            [MODULES.comments]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.events]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.places]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
            ],
            [MODULES.purchases]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.users]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
            ]
        },
        [UserRole.USER]: {
            [MODULES.categories]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
            ],
            [MODULES.comments]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ],
            [MODULES.events]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
            ],
            [MODULES.places]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
            ],
            [MODULES.purchases]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.add,
            ],
            [MODULES.users]: [
                PERMISSIONS.list,
                PERMISSIONS.detail,
                PERMISSIONS.edit,
                PERMISSIONS.add,
                PERMISSIONS.delete
            ]
        }
    } as const