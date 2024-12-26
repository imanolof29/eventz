export class LocationDto {
    latitude: number
    longitude: number
    name: string

    constructor(properties: { latitude: number, longitude: number, name: string }) {
        this.latitude = properties.latitude
        this.longitude = properties.longitude
        this.name = properties.name
    }

}