import {MissionStatus} from "./mission-status.enum";

export class Mission {
    #id!: number;
    #requestedDate!: Date | null;
    #parcelId!: number;
    #agrochemicalId!: number;
    #droneId!: number;
    #operatorId!: number;
    #flightHeight!: number | null;
    #flightSpeed!: number | null;
    #sprayRate!: number | null;
    #overlap!: number | null;
    #status!: MissionStatus | null;

    constructor(id: number, requestedDate: Date | null, parcelId: number, agrochemicalId: number, droneId: number, operatorId: number, flightHeight: number | null, flightSpeed: number | null, sprayRate: number | null, overlap: number | null, status: MissionStatus) {
        this.#id = id;
        this.#requestedDate = requestedDate;
        this.#parcelId = parcelId;
        this.#agrochemicalId = agrochemicalId;
        this.#droneId = droneId;
        this.#operatorId = operatorId;
        this.#flightHeight = flightHeight;
        this.#flightSpeed = flightSpeed;
        this.#sprayRate = sprayRate;
        this.#overlap = overlap;
        this.#status = status;
    }

    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get requestedDate(): Date | null {
        return this.#requestedDate;
    }

    set requestedDate(value: Date | null) {
        this.#requestedDate = value;
    }

    get parcelId(): number {
        return this.#parcelId;
    }

    set parcelId(value: number) {
        this.#parcelId = value;
    }

    get agrochemicalId(): number {
        return this.#agrochemicalId;
    }

    set agrochemicalId(value: number) {
        this.#agrochemicalId = value;
    }

    get droneId(): number {
        return this.#droneId;
    }

    set droneId(value: number) {
        this.#droneId = value;
    }

    get operatorId(): number {
        return this.#operatorId;
    }

    set operatorId(value: number) {
        this.#operatorId = value;
    }

    get flightHeight(): number | null {
        return this.#flightHeight;
    }

    set flightHeight(value: number | null) {
        this.#flightHeight = value;
    }

    get flightSpeed(): number | null {
        return this.#flightSpeed;
    }

    set flightSpeed(value: number | null) {
        this.#flightSpeed = value;
    }

    get sprayRate(): number | null {
        return this.#sprayRate;
    }

    set sprayRate(value: number | null) {
        this.#sprayRate = value;
    }

    get overlap(): number | null {
        return this.#overlap;
    }

    set overlap(value: number | null) {
        this.#overlap = value;
    }

    get status(): MissionStatus | null {
        return this.#status;
    }

    set status(value: MissionStatus | null) {
        this.#status = value;
    }
}