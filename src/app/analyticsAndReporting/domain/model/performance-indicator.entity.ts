/**
 * Indicator of operational performance consolidated for a period.
 */
export class PerformanceIndicator {
    #id!: number;
    #name!: string;
    #value!: number;
    #unit!: string;
    #period!: string;
    #calculatedAt!: string;

    constructor(id: number, name: string, value: number, unit: string, period: string, calculatedAt: string) {
        this.#id = id;
        this.#name = name;
        this.#value = value;
        this.#unit = unit;
        this.#period = period;
        this.#calculatedAt = calculatedAt;
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

    get value(): number {
        return this.#value;
    }

    set value(value: number) {
        this.#value = value;
    }

    get unit(): string {
        return this.#unit;
    }

    set unit(value: string) {
        this.#unit = value;
    }

    get period(): string {
        return this.#period;
    }

    set period(value: string) {
        this.#period = value;
    }

    get calculatedAt(): string {
        return this.#calculatedAt;
    }

    set calculatedAt(value: string) {
        this.#calculatedAt = value;
    }

    /**
     * Human-readable representation of the indicator.
     */
    toDisplay(): string {
        return `${this.#name}: ${this.#value} ${this.#unit} (${this.#period})`;
    }
}
