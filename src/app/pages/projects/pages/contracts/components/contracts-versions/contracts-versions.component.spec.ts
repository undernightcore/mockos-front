import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsVersionsComponent } from './contracts-versions.component';

describe('ContractsVersionsComponent', () => {
  let component: ContractsVersionsComponent;
  let fixture: ComponentFixture<ContractsVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
