import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioComponent } from './inventario-paciente.component';

describe('InventarioPacienteComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventarioComponent]
    });
    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
