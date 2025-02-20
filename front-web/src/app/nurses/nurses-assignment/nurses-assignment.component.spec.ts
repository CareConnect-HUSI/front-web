import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursesAssignmentComponent } from './nurses-assignment.component';

describe('NursesAssignmentComponent', () => {
  let component: NursesAssignmentComponent;
  let fixture: ComponentFixture<NursesAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NursesAssignmentComponent]
    });
    fixture = TestBed.createComponent(NursesAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
