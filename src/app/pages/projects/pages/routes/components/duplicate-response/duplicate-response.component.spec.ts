import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateResponseComponent } from './duplicate-response.component';

describe('DuplicateResponseComponent', () => {
  let component: DuplicateResponseComponent;
  let fixture: ComponentFixture<DuplicateResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
