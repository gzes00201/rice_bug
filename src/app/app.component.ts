import { Compiler, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private router: Router){

  }
  ngOnInit(): void {

  }

}
