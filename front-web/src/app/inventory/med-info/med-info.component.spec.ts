import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedInfoComponent } from './med-info.component';

describe('MedInfoComponent', () => {
  let component: MedInfoComponent;
  let fixture: ComponentFixture<MedInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedInfoComponent]
    });
    fixture = TestBed.createComponent(MedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
