

export class MaintenanceRecord {
    id: number;
    droneId: number;
    date: string;
    type: string;
    description: string;
    technician: string;

    constructor(
        id: number,
        droneId: number,
        date: string,
        type: string,
        description: string,
        technician: string
    ) {
        this.id = id;
        this.droneId = droneId;
        this.date = date;
        this.type = type;
        this.description = description;
        this.technician = technician;
    }

    getId(): number {
        return this.id;
    }
    getDroneId(){
        return this.droneId;
    }
    getDate(){
        return this.date;
    }
    getType(){
        return this.type;
    }
    getDescription(){
        return this.description;
    }
    getTechnician(){
        return this.technician;
    }
}