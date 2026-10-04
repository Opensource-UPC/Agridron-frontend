

export class Drone {
    id: number;
   serialNumber: string;
   model: string;
   batteryLevel: number;
   status: string;
   nozzleId: number;
   lastMaintenanceDate : string;
   nextMaintenanceDate : string;
   urlimg: string;

   constructor(id: number, serialNumber: string,
               model: string, batteryLevel: number, status: string,
               nozzleId: number, lastMaintenanceDate: string,
               nextMaintenanceDate: string, urlimg: string) {
       this.id = id;
       this.serialNumber = serialNumber;
       this.model = model;
       this.batteryLevel = batteryLevel;
       this.status = status;
       this.nozzleId = nozzleId;
       this.lastMaintenanceDate = lastMaintenanceDate;
       this.nextMaintenanceDate = nextMaintenanceDate;
       this.urlimg = urlimg;
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
   getNozzleId():number {
       return this.nozzleId;
   }
   getLastMaintenanceDate():string {
       return this.lastMaintenanceDate;
   }
   getNextMaintenanceDate():string {
       return this.nextMaintenanceDate;
   }

}
