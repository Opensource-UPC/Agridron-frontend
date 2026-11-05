
export class Drone {
    id: number;
   serialNumber: string;
   model: string;
   batteryLevel: number;
   status: DroneStatus;
   nozzleId: number;
   tankCapacityLiters: number;
   lastMaintenanceDate : string;
   nextMaintenanceDate : string;
   urlimg: string;
   flightHours: number;



   constructor(id: number, serialNumber: string,
               model: string, batteryLevel: number, status: DroneStatus,
               nozzleId: number, tankCapacityLiters: number ,lastMaintenanceDate: string,
               nextMaintenanceDate: string, urlimg: string, flightHours: number) {
       this.id = id;
       this.serialNumber = serialNumber;
       this.model = model;
       this.batteryLevel = batteryLevel;
       this.status = status;
       this.nozzleId = nozzleId;
       this.tankCapacityLiters = tankCapacityLiters;
       this.lastMaintenanceDate = lastMaintenanceDate;
       this.nextMaintenanceDate = nextMaintenanceDate;
       this.urlimg = urlimg;
       this.flightHours = flightHours;

   }

   getId():number {
       return this.id;
   }
   getSerialNumber():string {
       return this.serialNumber;
   }
   getModel():string {
       return this.model;
   }
   getBatteryLevel():number {
       return this.batteryLevel;
   }
   getStatus():string {
       return this.status;
   }
    /** Copia del dron con otro estado operativo (el resto de los datos no cambia). */
    withStatus(status: DroneStatus): Drone {
        return new Drone(this.id, this.serialNumber, this.model, this.batteryLevel, status,
            this.nozzleId, this.tankCapacityLiters, this.lastMaintenanceDate,
            this.nextMaintenanceDate, this.urlimg, this.flightHours);
    }

   getNozzleId():number {
       return this.nozzleId;
   }
   getLastMaintenanceDate():string {
       return this.lastMaintenanceDate;
   }
   getNextMaintenanceDate():string {
       return this.nextMaintenanceDate;
   }

    getFlightHours():number {
        return this.flightHours;
    }
}
