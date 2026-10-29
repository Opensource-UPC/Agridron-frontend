export class OperationStatusEntity {
    #id!: number;
    #missionId!: number;
    #latitude!: number;
    #longitude!: number;
    #status!: string;
    #timestamp!: Date;

    constructor(id: number, missionId: number, latitude: number, longitude: number, status: string, timestamp: Date) {
        this.#id = id;
        this.#missionId = missionId;
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#status = status;
        this.#timestamp = timestamp;
    }

    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get missionId(): number {
        return this.#missionId;
    }

    set missionId(value: number) {
        this.#missionId = value;
    }

    get latitude(): number {
        return this.#latitude;
    }

    set latitude(value: number) {
        this.#latitude = value;
    }

    get longitude(): number {
        return this.#longitude;
    }

    set longitude(value: number) {
        this.#longitude = value;
    }

    get status(): string {
        return this.#status;
    }

    set status(value: string) {
        this.#status = value;
    }

    get timestamp(): Date {
        return this.#timestamp;
    }

    set timestamp(value: Date) {
        this.#timestamp = value;
    }

    getInformation() : string {
        return `Operation status id: ${this.#id} - Mission id: ${this.#missionId} - Latitude: ${this.#latitude} - Longitude: ${this.#longitude} - Status: ${this.#status} - Timestamp: ${this.#timestamp}`;
    }

    UpdateLocation(latitude: number, longitude: number) {
        this.#latitude = latitude;
        this.#longitude = longitude;
    }
}