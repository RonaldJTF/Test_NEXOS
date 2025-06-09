import { AfterViewInit, Component, computed, ElementRef, input, OnInit, SimpleChanges } from '@angular/core';
import crossfilter from 'crossfilter';
import * as d3 from 'd3';
import { SegmentedRingChart } from 'src/assets/plugins/segmented-ring-chart.js';

@Component({
  selector: 'app-segmented-ring-chart',
  imports: [],
  templateUrl: './segmented-ring-chart.component.html',
  styleUrl: './segmented-ring-chart.component.scss'
})
export class SegmentedRingChartComponent implements OnInit, AfterViewInit {
  values = input<number[]>();
  labels = input<string[]>();
  aditionalInformation = input<{label: string, value: number, hexColor?: string}[][]>();

  data = computed<any[]>(() => {
    return this.values()?.map( (e, i) => {
      return {value: e, label: this.labels()?.[i]}
    })
  })
  
  private _initialized: boolean = false;

  segmentedRightChart: any;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this._initialized = true;
    this.generate();
  }

  ngOnInit(){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['values'] || changes['labels'] || changes['sublabels']) {
      if (this._initialized){
        this.generate();
      }
    }
  }

  generate(){
      let dim: any ={};
			let grp: any = {};

      const data = this.data() ?? [];
			let filter = crossfilter(data);
      data.sort((a, e) => -e.value + a.value)
      let resumeExtraDetails = [{label: 'Total stock', value:data.reduce((acc, e) => acc+e.value, 0), hexColor: '#29A7D4'}];

      dim.seguimiento = filter.dimension(d => {
        const text = d.label || '';
        return text.length > 18 ? text.substring(0, 18).toUpperCase() + '...' : text.toUpperCase();
      });

      grp.seguimiento = dim.seguimiento.group().reduceSum(e => e.value);

      let colorScale = d3.scaleOrdinal()
                        .domain(data.map(e => e.seguimiento))
                        .range(['#EF4424', '#FAC600', '#01C0FA', '#0ED290', '#27AE61', '#D41BCB', '#2E75B6', '#F7931E']);
      
      this.segmentedRightChart = new SegmentedRingChart("#segmented-ring-chart");


      this.segmentedRightChart
          .dimension(dim.seguimiento)
          .group(grp.seguimiento)
          .valueAccessor(function(d) {return d.value})
          .colorCalculator(function(d) {return colorScale(d.key)})
          .order((a, b) => b-a) 
          .details(this.aditionalInformation())
          .resume(resumeExtraDetails)
          .useViewBoxResizing(true) 
          .render();
  }
}

