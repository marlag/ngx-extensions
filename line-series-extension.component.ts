import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LineSeriesComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'g[ngx-charts-line-series-extension]', // tslint:disable-line: component-selector
  template: `
    <svg:g>
      <defs>
        <svg:g
          ngx-charts-svg-linear-gradient
          *ngIf="hasGradient"
          orientation="vertical"
          [name]="gradientId"
          [stops]="gradientStops"
        />
      </defs>
      <svg:g
        ngx-charts-area
        class="line-highlight"
        [data]="data"
        [path]="areaPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [opacity]="0.25"
        [startOpacity]="0"
        [gradient]="true"
        [stops]="areaGradientStops"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [animations]="false"
      />
      <svg:g
        ngx-charts-line
        class="line-series"
        [data]="data"
        [path]="path"
        [stroke]="stroke"
        [animations]="false"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
      />
      <svg:g
        ngx-charts-area
        *ngIf="hasRange"
        class="line-series-range"
        [data]="data"
        [path]="outerPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [opacity]="rangeFillOpacity"
        [animations]="false"
      />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineSeriesGapsNgxExtensionComponent extends LineSeriesComponent {

  getLineGenerator(): any {
    return super.getLineGenerator().defined(this.defined);
  }

  getRangeGenerator(): any {
    return super.getRangeGenerator().defined(this.defined);
  }

  getAreaGenerator(): any {
    return super.getAreaGenerator().defined(this.defined);
  }

  protected defined(item: any) {
    return item.value !== undefined && item.value !== null;
  }
}
