import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ElementRef, ViewChild, } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [],
  template: `
    <div class="gauge-container">
      <canvas #myChart></canvas>
    </div>
    `,
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnChanges, AfterViewInit {
  // Grab a native reference to the HTML canvas element
  @ViewChild('myChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 50;
  @Input() title = '';

  chartOption: any = {};
  ngOnChanges(changes: SimpleChanges) {
    if (changes['min'] || changes['max'] || changes['value']) {
      this.updateChartOption();
    }
  }

  private updateChartOption() {
    this.chartOption = {}
  }
  ngAfterViewInit(): void {
    this.onChartInit();
  }
  onChartInit() {
    console.log('chart init!');
    const remainingValue = this.max - this.value;
    const chartConfig: ChartConfiguration<'doughnut'> =
    {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.value, remainingValue],
          backgroundColor: ['#36A2EB', '#E0E0E0'], // Progress vs Background color
          borderWidth: 0,
        }]
      },
      options: {
        rotation: -90, // Starts the gauge from the bottom left
        circumference: 180, // Makes it a half-circle (semi-donut)
        cutout: '75%', // Controls the thickness of the gauge
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }

      },
      plugins: [{
        id: 'gaugeCenterText',
        afterDraw: (chart) => {
          const { ctx, chartArea: { top, bottom, left, right } } = chart;
          ctx.save();

          // Calculate center coordinates
          const x = (left + right) / 2;
          const y = bottom - 10; // Slightly adjusted upward to fit perfectly 

          // Text configuration
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillStyle = '#333333';

          // Render text
          ctx.fillText(`${this.value}%`, x, y);
          ctx.restore();
        }
      }],
    };
    this.chart = new Chart(
      this.chartCanvas.nativeElement,
      chartConfig);
  }
}