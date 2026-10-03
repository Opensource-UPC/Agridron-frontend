import {OperationalMetric} from './operational-metric.entity';
import {ReportType} from './report-type.enum';

/**
 * Report generated from a completed mission (summary or phytosanitary).
 */
export class MissionReport {
    #id!: number;
    #missionId!: number;
    #type!: ReportType;
    #treatedArea!: number;
    #appliedVolume!: number;
    #observations!: string;
    #generatedAt!: string;
    #metrics!: OperationalMetric[];

    constructor(
        id: number,
        missionId: number,
        type: ReportType,
        treatedArea: number,
        appliedVolume: number,
        observations: string,
        generatedAt: string,
        metrics: OperationalMetric[]
    ) {
        this.#id = id;
        this.#missionId = missionId;
        this.#type = type;
        this.#treatedArea = treatedArea;
        this.#appliedVolume = appliedVolume;
        this.#observations = observations;
        this.#generatedAt = generatedAt;
        this.#metrics = metrics;
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

    get type(): ReportType {
        return this.#type;
    }

    set type(value: ReportType) {
        this.#type = value;
    }

    get treatedArea(): number {
        return this.#treatedArea;
    }

    set treatedArea(value: number) {
        this.#treatedArea = value;
    }

    get appliedVolume(): number {
        return this.#appliedVolume;
    }

    set appliedVolume(value: number) {
        this.#appliedVolume = value;
    }

    get observations(): string {
        return this.#observations;
    }

    set observations(value: string) {
        this.#observations = value;
    }

    get generatedAt(): string {
        return this.#generatedAt;
    }

    set generatedAt(value: string) {
        this.#generatedAt = value;
    }

    get metrics(): OperationalMetric[] {
        return this.#metrics;
    }

    set metrics(value: OperationalMetric[]) {
        this.#metrics = value;
    }

    /**
     * Serializes the report in the requested format.
     * @param format - Output format (json by default).
     * @returns The report as text.
     */
    export(format: 'json' | 'csv' = 'json'): string {
        const base = {
            id: this.#id,
            missionId: this.#missionId,
            type: this.#type,
            treatedArea: this.#treatedArea,
            appliedVolume: this.#appliedVolume,
            observations: this.#observations,
            generatedAt: this.#generatedAt
        };
        if (format === 'csv') {
            const header = Object.keys(base).join(',');
            const row = Object.values(base)
                .map(v => `"${String(v).replace(/"/g, '""')}"`)
                .join(',');
            return `${header}\n${row}`;
        }
        return JSON.stringify({
            ...base,
            metrics: this.#metrics.map(m => ({name: m.name, value: m.value, unit: m.unit}))
        }, null, 2);
    }
}
