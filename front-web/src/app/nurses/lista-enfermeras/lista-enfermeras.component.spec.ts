import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEnfermerasComponent } from './lista-enfermeras.component';

describe('ListaEnfermerasComponent', () => {
  let component: ListaEnfermerasComponent;
  let fixture: ComponentFixture<ListaEnfermerasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEnfermerasComponent]
    });
    fixture = TestBed.createComponent(ListaEnfermerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
