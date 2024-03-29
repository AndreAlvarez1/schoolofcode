import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConectorService {

    // public url = 'http://localhost:9092'; //DEV
    public url = 'https://my-project-1514329660818.uc.r.appspot.com'


  constructor( private http:HttpClient,
               private router:Router) { }


  getDatos( ruta:string ) {
     return this.http.get( this.url  + ruta );
  }
            
  guardarDato(ruta:string, body:any) {
   return this.http.post( this.url  + ruta , body );
  }
                          
}
