import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import LocomotiveScroll from 'locomotive-scroll';
import { ConectorService } from 'src/app/services/conector.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

scroll: any;
meta:number       = 5000000
acumulado:number  = 0;
porcentaje:number = 51;
loadingTB         = false;

patreons = [{
            id:1,
            nombre:'Luz Maria',
            mail: 'lulu_guina@gmail.com',
            aporte: 15000,
            proyecto: 'crecemos1'
            },
            {
              id:2,
              nombre:'Luis Alvarez',
              mail: 'lalvarez@gour-net.cl',
              aporte: 10000,
              proyecto: 'crecemos1'
              }
            ]
  constructor(private conex: ConectorService,
              private router: Router) { }

  ngOnInit(): void {
  this.scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
  });

  }


donar(total:number){
  this.loadingTB = true;
  console.log('Quiero donar $', total);



  const body = {
    storeCode: 1,
    amount: total,
    buyOrder: 1 
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
                this.router.navigateByUrl(`/error`);
                return;
              }
              if(response.token === 'yaPagado'){
                this.router.navigateByUrl(`/exito`);
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
  

}
