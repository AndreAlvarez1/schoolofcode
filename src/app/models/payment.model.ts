export class PaymentModel {
    id:number;
    status:number;
    clientId:number;
    storeId:number;
    proyectoId:number;
    type:string;
    feed: string;	
    token: string;
    amount: number;
    auth_code: string;
    number_card: string;
    date_account:string;
    payment_type:string;	
    vci:string;	
    quotes:number;
    created_at:string;
   
    constructor(){
        this.status                 = 1;
        this.clientId               = 0;
        this.storeId                = 0;
        this.proyectoId             = 0;
        this.type                   = ''; //es como "el producto"
        this.feed                   = '';	
        this.token                  = '';
        this.amount                 = 0;
        this.auth_code              = '';
        this.number_card            = '';
        this.date_account           = '';
        this.payment_type           = '';
        this.vci                    = '';	
        this.quotes                 = 0;
        this.created_at             = '';
   } 
}
