import {Parcel} from "./parcel.entity";

export class Farm {

    #id!: number
    #name!: string;
    #location!: string;
    #ownerId!: number;
    #parcel!: Parcel[];
    #image!: string | null;


    constructor(id: number, name: string, location: string, ownerId: number, parcel: Parcel[], image: string | null = null) {
        this.#id = id;
        this.#name = name;
        this.#location = location;
        this.#ownerId = ownerId;
        this.#parcel = parcel;
        this.#image = image;
    }


    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get name(): string {
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
    }

    get location(): string {
        return this.#location;
    }

    set location(value: string) {
        this.#location = value;
    }

    get ownerId(): number {
        return this.#ownerId;
    }

    set ownerId(value: number) {
        this.#ownerId = value;
    }

    get parcel(): Parcel[] {
        return this.#parcel;
    }

    set parcel(value: Parcel[]) {
        this.#parcel = value;
    }

    get image(): string | null {
        return this.#image;
    }

    set image(value: string | null) {
        this.#image = value;
    }
}