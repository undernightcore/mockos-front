import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareResponsesComponent } from './compare-responses.component';

describe('CompareResponsesComponent', () => {
  let component: CompareResponsesComponent;
  let fixture: ComponentFixture<CompareResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareResponsesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
