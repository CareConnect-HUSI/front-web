import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroInventarioComponent } from './registro-inventario.component';

describe('RegistroInventarioComponent', () => {
  let component: RegistroInventarioComponent;
  let fixture: ComponentFixture<RegistroInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroInventarioComponent]
    });
    fixture = TestBed.createComponent(RegistroInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
