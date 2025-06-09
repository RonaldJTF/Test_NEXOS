import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedRingChartComponent } from './segmented-ring-chart.component';

describe('SegmentedRingChartComponent', () => {
  let component: SegmentedRingChartComponent;
  let fixture: ComponentFixture<SegmentedRingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedRingChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentedRingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
