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
  @Input() metric = '';
  @Input() title = '';

  ngOnChanges(changes: SimpleChanges) {
    // If the chart exists, update the data rather than re-init
    if (this.chart) {
      if (changes['value'] || changes['min'] || changes['max']) {
        this.updateChartData();
      }
    }
  }

  private updateChartData() {
    // 1. Update the dataset values
    this.chart.data.datasets[0].data = [this.value, this.max - this.value];

    // 2. Tell Chart.js to re-render with the new data
    this.chart.update('none'); // 'none' disables animation if it's too jittery
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
          backgroundColor: ['#3cd34e', '#E0E0E0'], // Progress vs Background color
          borderWidth: 0,
        }]
      },
      options: {
        rotation: -90, // Starts the gauge from the bottom left
        circumference: 180, // Makes it a half-circle (semi-donut)
        cutout: '65%', // Controls the thickness of the gauge
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }

      },
      plugins: [
        {
          id: 'gaugeCenterText',
        afterDraw: (chart) => {
          const { ctx, chartArea: { left, right, bottom, top } } = chart;
          // Calculate center coordinates
          const x = (left + right) / 2;
          const y = bottom - (bottom - top) * 0.30; // Move text up: higher percentage of the arc height
          ctx.save();
          // Text configuration
            ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 28px sans-serif'; // Larger and bolder
          ctx.fillStyle = '#ffffff'; // Contrasting white for dark background

          // Render text
          ctx.fillText(`${this.value} ${this.metric}`, x, y);
          ctx.restore();
        }
        },
        {
          id: 'analogNeedle',
          afterDraw: (chart) => {
            const { ctx, chartArea: { left, right, bottom,top } } = chart;
            ctx.save();

            // 1. Calculate needle angle based on percentage
            const percentage = this.value / this.max;
            const angle = (-Math.PI) + (percentage * Math.PI); // Half-circle math
            const centerX = (left + right) / 2;
            // const centerY = bottom;
            const centerY = bottom - (bottom - top) *.2;
            const radius = (right - left) / 2; // Length of needle

            // 2. Setup "Lit" Needle Style
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FF0000'; // The "glow" color
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';

            // 3. Draw Needle
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
              centerX + radius * Math.cos(angle),
              centerY + radius * Math.sin(angle)
            );
            ctx.stroke();

            // 4. Draw Center Pivot (The "Axle")
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
  }
}
      ],
    };
    this.chart = new Chart(
      this.chartCanvas.nativeElement,
      chartConfig);
  }
}

