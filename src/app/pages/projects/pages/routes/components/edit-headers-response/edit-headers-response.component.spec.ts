import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHeadersResponseComponent } from './edit-headers-response.component';

describe('EditHeadersResponseComponent', () => {
  let component: EditHeadersResponseComponent;
  let fixture: ComponentFixture<EditHeadersResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditHeadersResponseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeadersResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
