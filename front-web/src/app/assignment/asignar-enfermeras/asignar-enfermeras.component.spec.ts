import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarEnfermerasComponent } from './asignar-enfermeras.component';

describe('AsignarEnfermerasComponent', () => {
  let component: AsignarEnfermerasComponent;
  let fixture: ComponentFixture<AsignarEnfermerasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignarEnfermerasComponent]
    });
    fixture = TestBed.createComponent(AsignarEnfermerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
