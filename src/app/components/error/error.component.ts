import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentModel } from 'src/app/models/payment.model';
import { ConectorService } from 'src/app/services/conector.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  loading = true;
  id:any;
  pago: PaymentModel;

  constructor(private conex:ConectorService,
              private route: ActivatedRoute) {
              this.id = this.route.snapshot.paramMap.get('id');

               }

  ngOnInit(): void {
    this.conex.getDatos('/soc/general/payments/' + this.id)
    .subscribe( (resp:any) => {
      this.pago     = resp['datos'][0]
      console.log( 'pago', this.pago)
      this.loading  = false;
    })
  }

}
