export class CreateEventDto {
    name: string
    description: string
    latitude: number
    longitude: number
    images: string[]
    categoryIds: string[]
}