
export class Nozzle {
    id: number;
    type: string;
    diameterMm: number;
    stockUnits: number;
    status: string;

    constructor(
        id: number,
        type: string,
        diameterMm: number,
        stockUnits: number,
        status: string
    ) {
        this.id = id;
        this.type = type;
        this.diameterMm = diameterMm;
        this.stockUnits = stockUnits;
        this.status = status;
    }

    getId(): number {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getDiameterMm(): number {
        return this.diameterMm;
    }

    getStockUnits(): number {
        return this.stockUnits;
    }

    getStatus(): string {
        return this.status;
    }
}