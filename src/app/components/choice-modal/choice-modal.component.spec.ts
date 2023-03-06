import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceModalComponent } from './choice-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ChoiceModalComponent;
  let fixture: ComponentFixture<ChoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoiceModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
