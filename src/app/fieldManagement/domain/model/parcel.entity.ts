import {Crop} from "./crop.entity";
import {FumigationArea} from "./fumigationArea.entity";

export class Parcel {

    #id!: number;
    #name!: string;
    #area!: number;
    #geometry!: string;
    #farmId!: number;
    #cropId!: number;
    #crop?: Crop | null;


    constructor(id: number, name: string, area: number, geometry: string, farmId: number, cropId: number) {
        this.#id = id;
        this.#name = name;
        this.#area = area;
        this.#geometry = geometry;
        this.#farmId = farmId;
        this.#cropId = cropId;
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

    get area(): number {
        return this.#area;
    }

    set area(value: number) {
        this.#area = value;
    }

    get geometry(): string {
        return this.#geometry;
    }

    set geometry(value: string) {
        this.#geometry = value;
    }

    get farmId(): number {
        return this.#farmId;
    }

    set farmId(value: number) {
        this.#farmId = value;
    }

    get cropId(): number {
        return this.#cropId;
    }

    set cropId(value: number) {
        this.#cropId = value;
    }

    get crop(): Crop | null | undefined {
        return this.#crop;
    }

    set crop(value: Crop | null | undefined) {
        this.#crop = value;
    }
}