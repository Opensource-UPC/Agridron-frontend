/** Estados posibles de una unidad de boquilla en bodega. */
export type NozzleState = 'good' | 'worn' | 'damaged';

export const NOZZLE_STATES: NozzleState[] = ['good', 'worn', 'damaged'];

/** Tipos de boquilla que maneja el catálogo. */
export const NOZZLE_TYPES = ['flat-fan', 'hollow-cone', 'full-cone', 'air-induction'] as const;

export class Nozzle {
    id: number;
    type: string;
    diameterMm: number;
    /** Unidades en bodega en buen estado: listas para instalar. */
    goodUnits: number;
    /** Unidades en bodega desgastadas: se pueden instalar, con aviso. */
    wornUnits: number;
    /** Unidades en bodega dañadas: nunca se instalan. */
    damagedUnits: number;

    constructor(
        id: number,
        type: string,
        diameterMm: number,
        goodUnits: number,
        wornUnits: number,
        damagedUnits: number
    ) {
        this.id = id;
        this.type = type;
        this.diameterMm = diameterMm;
        this.goodUnits = goodUnits;
        this.wornUnits = wornUnits;
        this.damagedUnits = damagedUnits;
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

    /** Total en bodega: la suma de los tres estados. */
    get stockUnits(): number {
        return this.goodUnits + this.wornUnits + this.damagedUnits;
    }

    /** Unidades que se pueden instalar en un dron (buenas + desgastadas). */
    get installableUnits(): number {
        return this.goodUnits + this.wornUnits;
    }

    getStockUnits(): number {
        return this.stockUnits;
    }

    /** Cuántas unidades hay en el estado indicado. */
    unitsIn(state: NozzleState): number {
        switch (state) {
            case 'good': return this.goodUnits;
            case 'worn': return this.wornUnits;
            default: return this.damagedUnits;
        }
    }

    /**
     * Instalar una unidad en un dron: sale una unidad de bodega.
     * Se usa una BUENA si hay; si no quedan buenas, una desgastada.
     * Las dañadas nunca se instalan. Devuelve una boquilla nueva.
     */
    withUnitTaken(): Nozzle {
        if (this.goodUnits > 0) {
            return new Nozzle(this.id, this.type, this.diameterMm,
                this.goodUnits - 1, this.wornUnits, this.damagedUnits);
        }
        if (this.wornUnits > 0) {
            return new Nozzle(this.id, this.type, this.diameterMm,
                this.goodUnits, this.wornUnits - 1, this.damagedUnits);
        }
        throw new Error('No installable units');
    }

    /**
     * Retirar una unidad de un dron: vuelve a bodega en el estado indicado.
     * Devuelve una boquilla nueva.
     */
    withUnitReturned(state: NozzleState): Nozzle {
        const counts: Record<NozzleState, number> = {
            good: this.goodUnits,
            worn: this.wornUnits,
            damaged: this.damagedUnits
        };
        counts[state] += 1;
        return new Nozzle(this.id, this.type, this.diameterMm,
            counts.good, counts.worn, counts.damaged);
    }

    /**
     * Reponer stock: las unidades nuevas entran siempre como buenas.
     * Devuelve una boquilla nueva; no modifica la actual.
     */
    withRestocked(units: number): Nozzle {
        if (!Number.isInteger(units) || units < 1) {
            throw new Error('Units to add must be a positive integer');
        }
        return new Nozzle(this.id, this.type, this.diameterMm,
            this.goodUnits + units, this.wornUnits, this.damagedUnits);
    }

    /**
     * Actualizar estado: pasa `quantity` unidades de un estado a otro.
     * El total no cambia. Devuelve una boquilla nueva; no modifica la actual.
     */
    withUnitsMoved(from: NozzleState, to: NozzleState, quantity: number): Nozzle {
        if (from === to) {
            throw new Error('Origin and destination states must differ');
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error('Quantity must be a positive integer');
        }
        if (quantity > this.unitsIn(from)) {
            throw new Error('Not enough units in the origin state');
        }

        const counts: Record<NozzleState, number> = {
            good: this.goodUnits,
            worn: this.wornUnits,
            damaged: this.damagedUnits
        };
        counts[from] -= quantity;
        counts[to] += quantity;

        return new Nozzle(this.id, this.type, this.diameterMm,
            counts.good, counts.worn, counts.damaged);
    }
}