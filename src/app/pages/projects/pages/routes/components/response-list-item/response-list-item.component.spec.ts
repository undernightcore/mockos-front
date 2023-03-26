import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseListItemComponent } from './response-list-item.component';

describe('ResponseListItemComponent', () => {
  let component: ResponseListItemComponent;
  let fixture: ComponentFixture<ResponseListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
