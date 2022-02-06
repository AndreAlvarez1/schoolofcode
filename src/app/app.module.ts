import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ExitoComponent } from './components/exito/exito.component';
import { ErrorComponent } from './components/error/error.component';
// import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExitoComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    // RouterModule.forRoot(routes, { 
    //   useHash: true,
    //   anchorScrolling: 'enabled'
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
