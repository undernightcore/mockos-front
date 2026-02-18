import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPromptComponent } from './build-prompt.component';

describe('BuildPromptComponent', () => {
  let component: BuildPromptComponent;
  let fixture: ComponentFixture<BuildPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
