import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScannerComponent } from './scanner/scanner.component';
import { HomeComponent } from './home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CountdownPipe } from './pipe/countdown.pipe';
// import { Tp2Module } from './modules/tp2/tp2.module';
@NgModule({
  declarations: [
    AppComponent,
    ScannerComponent,
    HomeComponent,
    CountdownPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ZXingScannerModule,
    // Tp2Module,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
