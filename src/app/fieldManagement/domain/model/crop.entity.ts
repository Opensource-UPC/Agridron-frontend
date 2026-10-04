

export class Crop {
    #id!: number;
    #name!: string | null;
    #variety!: string | null;


    constructor(id: number, name: string | null, variety: string | null) {
        this.#id = id;
        this.#name = name;
        this.#variety = variety;
    }


    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get name(): string | null {
        return this.#name;
    }

    set name(value: string | null) {
        this.#name = value;
    }

    get variety(): string | null {
        return this.#variety;
    }

    set variety(value: string | null) {
        this.#variety = value;
    }

    getInformation(){
        return `${this.#name ?? 'Unknown'} (${this.#variety ?? 'N/A'})`;
    }


}