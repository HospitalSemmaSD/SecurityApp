import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRangeComponent } from './create-range.component';

describe('CreateRangeComponent', () => {
  let component: CreateRangeComponent;
  let fixture: ComponentFixture<CreateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
