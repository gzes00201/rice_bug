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
    import('./modules/tp1/tp1.module').then(loadedModule => {
      const lazyPageModule = loadedModule.Tp1Module;
      this.compiler.compileModuleAsync(lazyPageModule).then(moduleFactory => {
        const moduleRef = moduleFactory.create(this.injector);
        console.log(moduleRef);
        this.router.navigate(['/tp']);
      });
    });
  }

}
