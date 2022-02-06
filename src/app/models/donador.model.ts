export class DonadorModel {
    id:number;
    firstname: string;
    lastname: string;
    email: string;
    cel: string;
    status: number;
    origen: string;

   constructor() {
    this.firstname  = '';
    this.lastname   = '';
    this.email      = '';
    this.cel        = '';
    this.status     = 1;
    this.origen     = 'School of Code';
   }
}

