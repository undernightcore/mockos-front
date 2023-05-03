import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeInfoComponent } from './code-info.component';

describe('CodeInfoComponent', () => {
  let component: CodeInfoComponent;
  let fixture: ComponentFixture<CodeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
