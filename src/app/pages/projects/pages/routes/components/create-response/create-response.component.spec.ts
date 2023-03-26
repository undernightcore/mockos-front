import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResponseComponent } from './create-response.component';

describe('CreateResponseComponent', () => {
  let component: CreateResponseComponent;
  let fixture: ComponentFixture<CreateResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
