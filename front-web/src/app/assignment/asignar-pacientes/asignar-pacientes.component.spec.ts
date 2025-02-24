import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPacientesComponent } from './asignar-pacientes.component';

describe('AsignarPacientesComponent', () => {
  let component: AsignarPacientesComponent;
  let fixture: ComponentFixture<AsignarPacientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignarPacientesComponent]
    });
    fixture = TestBed.createComponent(AsignarPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
