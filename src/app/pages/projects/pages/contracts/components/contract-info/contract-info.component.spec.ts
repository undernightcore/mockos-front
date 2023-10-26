import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractInfoComponent } from './contract-info.component';

describe('ContractInfoComponent', () => {
  let component: ContractInfoComponent;
  let fixture: ComponentFixture<ContractInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
