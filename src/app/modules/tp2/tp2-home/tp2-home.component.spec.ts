import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tp2HomeComponent } from './tp2-home.component';

describe('Tp1HomeComponent', () => {
  let component: Tp2HomeComponent;
  let fixture: ComponentFixture<Tp2HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tp2HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tp2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
