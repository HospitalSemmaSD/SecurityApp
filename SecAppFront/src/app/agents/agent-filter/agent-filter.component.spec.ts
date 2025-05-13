import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFilterComponent } from './agent-filter.component';

describe('AgentFilterComponent', () => {
  let component: AgentFilterComponent;
  let fixture: ComponentFixture<AgentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
