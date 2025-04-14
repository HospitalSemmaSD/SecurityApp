import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangesListComponent } from './ranges-list.component';

describe('RangesListComponent', () => {
  let component: RangesListComponent;
  let fixture: ComponentFixture<RangesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
