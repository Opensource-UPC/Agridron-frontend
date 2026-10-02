

export class FumigationArea {

    #id!: number;
    #parcelId!: number;
    #geometry!: string;
    #area!: number;


    constructor(id: number, parcelId: number, geometry: string, area: number) {
        this.#id = id;
        this.#parcelId = parcelId;
        this.#geometry = geometry;
        this.#area = area;
    }


    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get parcelId(): number {
        return this.#parcelId;
    }

    set parcelId(value: number) {
        this.#parcelId = value;
    }

    get geometry(): string {
        return this.#geometry;
    }

    set geometry(value: string) {
        this.#geometry = value;
    }

    get area(): number {
        return this.#area;
    }

    set area(value: number) {
        this.#area = value;
    }

    calculateArea(){

    }

    updateGeometry(){

    }
}