
export class Agrochemicals {

    id:number;
    name: string;
    type: string;
    stockLiters: number;
    minimumStockLiters: number;
    expirationDate: string;

    constructor(id:number, name: string, type: string, stockLiters: number, minimumStockLiters: number, expirationDate: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.stockLiters = stockLiters;
        this.minimumStockLiters = minimumStockLiters;
        this.expirationDate = expirationDate;
    }

    getId(){
        return this.id;
    }
    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }
    getStockLiters(){
        return this.stockLiters;
    }
    getMinimumStockLiters(){
        return this.minimumStockLiters;
    }
}
