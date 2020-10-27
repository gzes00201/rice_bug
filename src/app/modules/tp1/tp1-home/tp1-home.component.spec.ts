import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tp1HomeComponent } from './tp1-home.component';

describe('Tp1HomeComponent', () => {
  let component: Tp1HomeComponent;
  let fixture: ComponentFixture<Tp1HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tp1HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tp1HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
