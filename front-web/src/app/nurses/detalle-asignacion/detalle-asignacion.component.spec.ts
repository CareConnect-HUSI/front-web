import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAsignacionComponent } from './detalle-asignacion.component';

describe('DetalleAsignacionComponent', () => {
  let component: DetalleAsignacionComponent;
  let fixture: ComponentFixture<DetalleAsignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAsignacionComponent]
    });
    fixture = TestBed.createComponent(DetalleAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
