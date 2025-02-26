import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEnfermerasComponent } from './registro-enfermeras.component';

describe('RegistroEnfermerasComponent', () => {
  let component: RegistroEnfermerasComponent;
  let fixture: ComponentFixture<RegistroEnfermerasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEnfermerasComponent]
    });
    fixture = TestBed.createComponent(RegistroEnfermerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
