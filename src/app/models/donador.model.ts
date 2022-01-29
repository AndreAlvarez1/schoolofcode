export class DonadorModel {
    id:string;
    nombre: string;
    mail: string;
    aporte: number;
    proyecto: string;

   constructor() {
    this.nombre = '';
    this.mail = '';
    this.aporte = 0;
    this.proyecto = '';
   }
}

