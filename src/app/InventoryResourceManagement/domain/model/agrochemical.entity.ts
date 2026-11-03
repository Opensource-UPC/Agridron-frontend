/** Categorías de producto que maneja el catálogo. */
export const AGROCHEMICAL_TYPES =
    ['herbicide', 'insecticide', 'fungicide', 'fertilizer', 'other'] as const;

/**
 * Producto agroquímico autorizado (DR-003).
 *
 * - name: denominación comercial.
 * - activeIngredient: ingrediente activo (obligatorio para habilitar el producto).
 * - recommendedDoseLitersPerHa: dosis recomendada, en litros por hectárea (obligatoria).
 */
export class Agrochemicals {

    id: number;
    name: string;
    type: string;
    activeIngredient: string;
    recommendedDoseLitersPerHa: number;
    stockLiters: number;
    minimumStockLiters: number;
    expirationDate: string;

    constructor(
        id: number,
        name: string,
        type: string,
        activeIngredient: string,
        recommendedDoseLitersPerHa: number,
        stockLiters: number,
        minimumStockLiters: number,
        expirationDate: string
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.activeIngredient = activeIngredient;
        this.recommendedDoseLitersPerHa = recommendedDoseLitersPerHa;
        this.stockLiters = stockLiters;
        this.minimumStockLiters = minimumStockLiters;
        this.expirationDate = expirationDate;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getStockLiters() {
        return this.stockLiters;
    }

    getMinimumStockLiters() {
        return this.minimumStockLiters;
    }

    /** ¿El stock llegó al mínimo o quedó por debajo? */
    get lowStock(): boolean {
        return this.stockLiters <= this.minimumStockLiters;
    }

    /** ¿El producto ya venció? Se compara con la fecha de hoy (AAAA-MM-DD). */
    isExpired(today: string): boolean {
        return !!this.expirationDate && this.expirationDate < today;
    }
}