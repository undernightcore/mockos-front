import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpChipComponent } from './http-chip.component';

describe('HttpChipComponent', () => {
  let component: HttpChipComponent;
  let fixture: ComponentFixture<HttpChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttpChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
