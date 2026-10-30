
export class MissionResult {
    #id!: number;
    #missionId!: number;
    #treatedArea!: number | null;
    #appliedVolume!: number | null;
    #observations!: string | null;

    constructor(id: number, missionId: number, treatedArea: number | null, appliedVolume: number | null, observations: string | null) {
        this.#id = id;
        this.#missionId = missionId;
        this.#treatedArea = treatedArea;
        this.#appliedVolume = appliedVolume;
        this.#observations = observations;
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

    get treatedArea(): number | null {
        return this.#treatedArea;
    }

    set treatedArea(value: number | null) {
        this.#treatedArea = value;
    }

    get appliedVolume(): number | null {
        return this.#appliedVolume;
    }

    set appliedVolume(value: number | null) {
        this.#appliedVolume = value;
    }

    get observations(): string | null {
        return this.#observations;
    }

    set observations(value: string | null) {
        this.#observations = value;
    }

    getInformation() : string {
        return `Mission result id: ${this.#id} - Mission id: ${this.#missionId} - Treated area: ${this.#treatedArea} - Applied volume: ${this.#appliedVolume} - Observations: ${this.#observations}`;
    }
}