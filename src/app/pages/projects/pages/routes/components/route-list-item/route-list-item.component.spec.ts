import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteListItemComponent } from './route-list-item.component';

describe('RouteListItemComponent', () => {
  let component: RouteListItemComponent;
  let fixture: ComponentFixture<RouteListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
