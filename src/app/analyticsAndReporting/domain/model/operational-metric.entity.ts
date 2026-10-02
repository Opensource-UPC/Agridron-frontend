/**
 * Measurable value (name, value, unit) that belongs to a mission report.
 */
export class OperationalMetric {
    #id!: number;
    #reportId!: number;
    #name!: string;
    #value!: number;
    #unit!: string;

    constructor(id: number, reportId: number, name: string, value: number, unit: string) {
        this.#id = id;
        this.#reportId = reportId;
        this.#name = name;
        this.#value = value;
        this.#unit = unit;
    }

    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get reportId(): number {
        return this.#reportId;
    }

    set reportId(value: number) {
        this.#reportId = value;
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

    /**
     * Human-readable representation of the metric.
     */
    toDisplay(): string {
        return `${this.#name}: ${this.#value} ${this.#unit}`;
    }
}
