import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConectorService } from 'src/app/services/conector.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  loading              = true;
  admin                = false;
  donacionesAll:any[]  = [];
  donaciones:any[]     = [];
  totales = { VD:0,
              VN:0,
              TotalPreComisiones: 0,
              TotalPostComisiones: 0           
  }

  estados = [{tipo:'Pagados', status: 2},{tipo:'inconclusa', status: 1},  {tipo:'otro', status: 3},]

  constructor(private conex:ConectorService,
              private router: Router) { }

  ngOnInit(): void {
    this.preguntarPass();
    this.getDonaciones();
  }


  getDonaciones(){
    this.loading = true;
    this.donacionesAll = [];

    this.conex.getDatos('/soc/paymentsXproyecto/1')
              .subscribe( resp => { 
                for (let d of resp['datos']){
                  const donacion = d;
                  donacion.amount = Number(donacion.amount);
                  donacion.detalle = JSON.parse(d.feed);
                  this.donacionesAll.push(donacion);
                }

                this.filtrarDonaciones(2);
              })
            }
            
            
filtrarDonaciones(tipo){

    this.totales = { VD:0,
                    VN:0,
                    TotalPreComisiones: 0,
                    TotalPostComisiones: 0           
                }
    this.donaciones = this.donacionesAll.filter( d => d.status == tipo);
                
    for (let d of this.donaciones){
        this.sumarAmount(d);
    }

    this.calcularComisiones();
                
    this.loading = false;
    console.log('donaciones', this.donaciones);
  }


  sumarAmount(d){
    if(d.payment_type == 'VD'){
      this.totales.VD += d.amount;
    }
   
    if(d.payment_type == 'VP'){
      this.totales.VD += d.amount;
    }
   
    if(d.payment_type == 'VN'){
      this.totales.VN += d.amount;
    }

    this.totales.TotalPreComisiones += d.amount;
  }


  calcularComisiones(){
    const comisionDebito = this.totales.VD - (this.totales.VD * 0.0142);
    const comisionNormal = this.totales.VN - (this.totales.VN * 0.0248);
    console.log('comisiones Debito', comisionDebito);
    console.log('comisiones Credito', comisionNormal);
    this.totales.TotalPostComisiones = comisionDebito + comisionNormal;

    console.log('totales', this.totales);
  }




  verPago(d){
    console.log('d',d);
  }







  preguntarPass(){
    Swal.fire({
      title: 'Acceso para admin',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Entrar',
      showLoaderOnConfirm: true,
      preConfirm: (login:any) => {
        console.log('login', login);
        if (login === 'afrodita12'){
          console.log('ok');
          this.admin = true;
        } else{
          Swal.showValidationMessage(
            'Contraseña equivocada, ponte en contacto con soporte Gour-net'
          )
          this.router.navigateByUrl('/home');
          Swal.close();
        }
      },
      // allowOutsideClick: () => !Swal.isLoading()
    })
  }

}
