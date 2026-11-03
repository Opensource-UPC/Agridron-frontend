
export class Incident {
    #id!: number;
    #missionId!: number;
    #type!: string | null;
    #description!: string | null;
    #occurredAt!: Date | null;

    constructor(id: number, missionId: number, type: string | null, description: string | null, occurredAt: Date | null) {
        this.#id = id;
        this.#missionId = missionId;
        this.#type = type;
        this.#description = description;
        this.#occurredAt = occurredAt;
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

    get type(): string | null {
        return this.#type;
    }

    set type(value: string | null) {
        this.#type = value;
    }

    get description(): string | null {
        return this.#description;
    }

    set description(value: string | null) {
        this.#description = value;
    }

    get occurredAt(): Date | null {
        return this.#occurredAt;
    }

    set occurredAt(value: Date | null) {
        this.#occurredAt = value;
    }

    getInformation() : string {
        return `Incident id: ${this.#id} - Mission id: ${this.#missionId} - Type: ${this.#type} - Description: ${this.#description} - Occured at: ${this.#occurredAt}`;
    }
}