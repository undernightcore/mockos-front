import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareContractsComponent } from './compare-contracts.component';

describe('CompareContractsComponent', () => {
  let component: CompareContractsComponent;
  let fixture: ComponentFixture<CompareContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
