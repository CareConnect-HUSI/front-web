import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMedicamentoComponent } from './info-medicamento.component';

describe('InfoMedicamentoComponent', () => {
  let component: InfoMedicamentoComponent;
  let fixture: ComponentFixture<InfoMedicamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoMedicamentoComponent]
    });
    fixture = TestBed.createComponent(InfoMedicamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
