import { Component, OnInit } from '@angular/core';
import LocomotiveScroll from 'locomotive-scroll';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DonadorModel } from 'src/app/models/donador.model';
import { PaymentModel } from 'src/app/models/payment.model';

import { ConectorService } from 'src/app/services/conector.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

scroll: any;
hoy                    = new Date().toLocaleDateString();
store:any;
meta:number            = 0;
acumulado:number       = 0;
porcentaje:number      = 0;

loadingTB              = false;
modalDonador           = false;

pago: PaymentModel     = new PaymentModel()
donador: DonadorModel  = new DonadorModel();
items                  = []; 
patreons               = []
  constructor(private conex: ConectorService,
              private router: Router) { 
                console.log('new date ', this.hoy);
                this.getTienda();
                this.getProyecto();
              }

  ngOnInit(): void {
  this.scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
  });

  }


  getTienda(){
    this.conex.getDatos('/soc/general/stores/2') 
              .subscribe( (resp:any) => { 
                this.store = resp['datos'][0]
                console.log('tienda', this.store);
              })
  }
  
  getProyecto(){
    this.conex.getDatos('/soc/general/proyectos/1') 
              .subscribe( (resp:any) => { 
                this.meta = resp['datos'][0].META
                console.log('meta', this.meta);
                this.getDonaciones();
              })
  }







  getDonaciones(){
    this.conex.getDatos('/soc/donaciones/1') 
              .subscribe( (resp:any) => { 

                console.log('donaciones', resp)

                this.patreons = resp['datos'].filter( p => p.proyectoId = 1 );
                for ( let d of this.patreons){
                  this.acumulado += Number(d.amount)
                }

                this.porcentaje = this.acumulado * 100 / this.meta;
                console.log('acumulado', this.acumulado);
                console.log('patreons', this.patreons);
                console.log('porecenta', this.porcentaje);
              })
  }




// ======================================== //
// ======================================== //
// ======================================== //
// ======================================== //
// FUNCIONES DE PAGOO //
// ======================================== //
// ======================================== //
// ======================================== //
// ======================================== //



  abrirDonacion(name:string, total:number){
    this.modalDonador = true;

    this.pago = new PaymentModel();
    this.pago.amount = total;
    this.items = []
    let producto = {item:name, amount: total};
    this.items.push(producto);

    this.pago.feed = JSON.stringify(this.items);
  }

  // 
  crearUsuario(form:NgForm){
    if (!form.valid){
      this.error('Falta llenar algunos datos');
      return;
    }


    this.conex.getDatos(`/soc/user/${this.donador.email}`)
                        .subscribe ( (resp:any) => { 
                            console.log('el usuario', resp)
                            if (resp['datos'].length < 1){
                              this.guardarUsuario()
                            } else {
                              this.donador = resp['datos'][0];
                              this.crearPayment(this.donador.id);
                            }
                        })
  }


 guardarUsuario(){
  console.log('crear usuarios', this.donador);
  this.conex.guardarDato('/soc/post/clientes/insert', this.donador)
            .subscribe( (resp:any) => { 
            console.log('resp guardé usuario id', resp['datos'].insertId)
            this.crearPayment(resp['datos'].insertId)

  })
  
 }

 

  anonimo(){
    console.log('donar como anonimo');
    this.donador.id = 1;
    this.donador.firstname = 'Anonimo';
    this.donador.lastname = 'Anon';
    this.donador.email = 'anon@gmail.com';
    this.crearPayment(1);
  }
  
  
  crearPayment(userId:number){

    console.log('crear payment', this.pago, 'de', this.donador);
    this.pago.clientId         = userId;
    this.pago.created_at       = this.hoy;
    this.pago.proyectoId       = 1;
    this.pago.storeId          = 2;
    this.pago.type             = 'transbank'

    this.conex.guardarDato('/soc/post/pago/insert', this.pago)
              .subscribe( (resp:any) => {
                console.log('guardé pago', resp);
                this.pago.id = resp['datos'].insertId;
                this.donar()
               })
  }




  donar(){
    this.loadingTB = true;
    console.log('Quiero donar $', this.pago.amount);
  
  
  
    const body = {
                  storeCode: this.pago.storeId,
                  amount: this.pago.amount,
                  buyOrder: this.pago.id.toString(),
                  sessionId: 'S' + this.pago.id,
                  codigoComercio: this.store.codComercio,
                  apikey: this.store.apikey
                  };
  
    
    let response = {
                        token: '',
                        url: '',
                        orderId: '',
                    };
  
    this.conex.guardarDato(`/wp/pagoAppetito`, body)
              .subscribe( resp => {
                console.log('testWP', resp);
                response.token = resp['token'];
                response.url = resp['url'];
                response.orderId = 'orderId';
                console.log('response', response);
                this.loadingTB = false;
  
                if(response.token === 'errorMontos'){
                  this.router.navigateByUrl(`/error/0`);
                  return;
                }
                if(response.token === 'yaPagado'){
                  this.router.navigateByUrl(`/exito/0`);
                  return;
                }
  
                this.postear(response)
              }, err => {
                console.log('error webpay', err);
              })
  
  
  }
  
  
  
  
  
  postear(resp){
    const mapForm = document.createElement('form');
    mapForm.method = 'POST';
    mapForm.action = `${resp.url}`;
    mapForm.style.display = 'none';
    
    const mapInput = document.createElement('input');
    mapInput.type = 'hidden';
    mapInput.name = 'token_ws';
    mapInput.value = resp.token;
    mapForm.appendChild(mapInput);
    
    const mapInput1 = document.createElement('input');
    mapInput1.type = 'hidden';
    mapInput1.name = 'orderId';
    mapInput1.value = resp.orderId;
    mapForm.appendChild(mapInput1);
    
    const mapInput2 = document.createElement('input');
    mapInput1.type = 'hidden';
    mapInput1.name = 'storeId';
    mapInput1.value = '1'; // HACER DINAMICO
    mapForm.appendChild(mapInput2);
    
    
    
    document.body.appendChild(mapForm);
    
    mapForm.submit();
    }
    
    
    
    apretarWebPay(f){
      f.submit();
    }



  // Mensajes
  
error(mensaje){
  Swal.fire({
    title: 'Whooops',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Cool'
  })
}
}
