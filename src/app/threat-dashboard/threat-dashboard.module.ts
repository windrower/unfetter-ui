import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, 
  MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule 
} from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { GlobalModule } from '../global/global.module';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { CollapsibleTreeComponent } from './collapsible-tree/collapsible-tree.component';
import { ExportComponent } from './export/export.component';
import { MitigationComponent } from './mitigation/mitigation.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import { ThreatDashboardComponent } from './threat-dashboard.component';
import { routing } from './threat-dashboard.routing';
import { ReportEditorComponent } from './threat-report-editor/report-editor/report-editor.component';
import { ReportImporterComponent } from './threat-report-editor/report-importer/report-importer.component';
import { ThreatReportEditorComponent } from './threat-report-editor/threat-report-editor.component';
import { ThreatReportNavigateGuard } from './threat-report-navigate.guard';
import { ThreatTacticsComponent } from './threat-tactics/threat-tactics.component';

const moduleComponents = [
  BarChartComponent,
  CollapsibleTreeComponent,
  ExportComponent,
  MitigationComponent,
  RadarChartComponent,
  ReportEditorComponent,
  ReportImporterComponent,
  ThreatDashboardComponent,
  ThreatReportEditorComponent,
  ThreatTacticsComponent,
];

const moduleServices = [
];

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  OverlayModule,
  PlatformModule,
];

@NgModule({
  declarations: [
    ...moduleComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules,
    ClipboardModule,
    GlobalModule,
    routing,
  ],
  providers: [
    ...moduleServices,
    ThreatReportNavigateGuard,
  ],
  entryComponents: [ReportEditorComponent, ReportImporterComponent]
})
export class ThreatDashboardModule { }
