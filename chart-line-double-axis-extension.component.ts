import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, ViewEncapsulation } from '@angular/core';
import { LineChartComponent } from '@swimlane/ngx-charts';

/**
 * Ngx-charts extension for handling secondary y-axis.
 * Uses yAxis property (0/undefined|1) for indicating axis to place.
 *
 * Includes handling null values as discontinued line indicator
 */
@Component({
  selector: 'ngx-chart-line-double-axis', // tslint:disable-line: component-selector
  templateUrl: './chart-line-double-axis-extension.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate(500, style({ opacity: 0 })),
      ])
    ])
  ],
})
export class ChartLineDoubleAxisExtensionComponent extends LineChartComponent implements OnChanges {

  @Input() yScalesMin: number[];
  @Input() yScalesMax: number[];
  @Input() showYAxisLabels: boolean[] = [];
  @Input() yAxisLabels: boolean[] = [];

  resultsSplit: any[] = [];
  referenceLinesSplit: any[] = [];
  yScales: any[] = [];
  yDomains: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.resultsSplit = this.extract(this.results);
    this.referenceLinesSplit = this.extract(this.referenceLines);

    super.ngOnChanges(changes);
  }

  update() {
    // additional margin for left labels
    if (this.yAxis && this.resultsSplit.length > 1) {
      this.margin[1] = 20 + (this.resultsSplit.length - 1) * 40;
    }
    // base update
    super.update();
    // duplicate relevant values
    this.resultsSplit.forEach((e, i) => {
      this.yDomains[i] = this.getYDomain(i);
      this.yScales[i] = this.getYScale(this.yDomains[i], this.dims.height);
    });

  }

  getYDomain(idx?: number): any[] {
    const domain = [];
    for (const results of this.resultsSplit[idx || 0]) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          this.hasRange = true;
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    const values = [...domain];
    if (!this.autoScale) {
      values.push(0);
    }

    const min = this.yScalesMin ? (this.yScalesMin[idx] || this.yScalesMin[0] || this.yScalesMin) : Math.min(...values);
    const max = this.yScalesMax ? (this.yScalesMax[idx] || this.yScalesMax[0] || this.yScalesMax) : Math.max(...values);

    return [min, max];
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  protected extract(items: any[]) {
    const res = [];

    (items || []).forEach(item => {
      const idx = item.yAxis || 0;
      res[idx] = res[idx] || [];
      res[idx].push(item);
    });

    return res;
  }

}
