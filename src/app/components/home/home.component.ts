import { Component, OnInit } from '@angular/core';
import LocomotiveScroll from 'locomotive-scroll';


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
  constructor() { }

  ngOnInit(): void {
  this.scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
  });

  }


donar(total:number){
  console.log('Quiero donar $', total);
}
}
