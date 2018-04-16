import {
        Component,
        OnInit,
        Inject,
        Input,
        ViewChild,
        ElementRef,
        TemplateRef,
        ViewContainerRef,
        ChangeDetectorRef,
    } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { IndicatorSharingFeatureState } from '../store/indicator-sharing.reducers';
import { HeatmapComponent } from '../../global/components/heatmap/heatmap.component';
import { HeatMapOptions } from '../../global/components/heatmap/heatmap.data';
import { GenericApi } from '../../core/services/genericapi.service';
import { Constance } from '../../utils/constance';

@Component({
    selector: 'indicator-heat-map',
    templateUrl: './indicator-heat-map.component.html',
    styleUrls: ['./indicator-heat-map.component.scss'],
})
export class IndicatorHeatMapComponent implements OnInit {

    public heatmap: any[] = [];
    @ViewChild('heatmapView') private heatmapView: HeatmapComponent;
    @Input() heatmapOptions: HeatMapOptions = {
        color: {
            batchColors: [
                {header: {bg: '.odd', fg: '#333'}, body: {bg: '.odd', fg: 'black'}},
                {header: {bg: 'transparent', fg: '#333'}, body: {bg: 'transparent', fg: 'black'}},
            ],
            heatColors: {
                'inactive': {bg: '#eee', fg: 'black'},
                'selected': {bg: '.selected', fg: 'black'},
            },
        },
        text: {
            showCellText: true,
        },
        zoom: {
            hasMinimap: false,
            cellTitleExtent: 1,
        },
    }

    public attackPatterns = {};
    public attackPattern = null;
    public selectedPatterns = [];

    @ViewChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;
    private overlayRef: OverlayRef;
    private portal: TemplatePortal<any>;

    constructor(
        public dialogRef: MatDialogRef<IndicatorHeatMapComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public genericApi: GenericApi,
        private overlay: Overlay,
        private vcr: ViewContainerRef,
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.loadAttackPatterns();
    }

    /**
     * @description retrieve the attack patterns and their tactics phases from the backend database
     */
    private loadAttackPatterns() {
        const sort = { 'stix.name': '1' };
        const project = {
            'stix.name': 1,
            'stix.description': 1,
            'stix.kill_chain_phases': 1,
            'extendedProperties.x_mitre_data_sources': 1,
            'extendedProperties.x_mitre_platforms': 1,
            'stix.id': 1,
        };
        const filter = encodeURI(`sort=${JSON.stringify(sort)}&project=${JSON.stringify(project)}`);
        const initData$ = this.genericApi.get(`${Constance.ATTACK_PATTERN_URL}?${filter}`)
            .finally(() => {
                if (initData$) {
                    initData$.unsubscribe();
                }
            })
            .subscribe(
                (results: any[]) => {
                    const collects = {attackPatterns: {}, phases: {}};
                    this.attackPatterns = results.reduce(
                        (collect, pattern) => this.collectAttackPatterns(collect, pattern), collects).attackPatterns;
                    this.heatmap = this.groupAttackPatternsByKillchain(collects.phases);
                },
                (err) => console.log(err)
            );
    }

    /**
     * @description now group up all the phases and the attack patterns they have, for the heatmap display
     */
    private collectAttackPatterns(collects, pattern) {
        const name = pattern.attributes.name;
        if (name) {
            collects.attackPatterns[name] = Object.assign({}, {
                title: name,
                name: name,
                id: pattern.attributes.id,
                description: pattern.attributes.description,
                phases: (pattern.attributes.kill_chain_phases || []).map(p => p.phase_name),
                sources: pattern.attributes.x_mitre_data_sources,
                platforms: pattern.attributes.x_mitre_platforms,
                value: 'inactive',
            });
        }

        (pattern.attributes.kill_chain_phases || [])
            .forEach(p => {
                const batch = p.phase_name
                    .replace(/\-/g, ' ')
                    .split(/\s+/)
                    .map(w => w[0].toUpperCase() + w.slice(1))
                    .join(' ')
                    .replace(/\sAnd\s/g, ' and ')
                    ;
                collects.phases[p.phase_name] = {
                    title: batch,
                    value: null,
                    cells: [],
                };
            });

        return collects;
    }

    /**
     * @description creates any array of tactics (phases, or kill-chains) as batches of attack patterns for the heatmap
     */
    private groupAttackPatternsByKillchain(tactics: any): any[] {
        Object.values(this.attackPatterns).forEach((attackPattern: any) => {
            const selected = this.data.active && this.data.active.includes(attackPattern.id);
            if (selected) {
                this.selectedPatterns.push(attackPattern);
                attackPattern.value = 'selected';
            }
            const phases = attackPattern.phases;
            if (phases) {
                phases.forEach((phase) => {
                    let group = tactics[phase];
                    if (group) {
                        group.cells.push(attackPattern);
                    }
                });
            }
        });
        return Object.values(tactics);
    }

    /**
     * @description display a tooltip for the attack pattern the user is hovering over
     */
    public onTooltip(selection?: any) {
        if (!selection || !selection.row || !selection.row.name) {
            this.hideTooltip();
        } else {
            let attackPattern = this.attackPatterns[selection.row.name];
            if (attackPattern && (!this.attackPattern || (this.attackPattern.name !== attackPattern.name))) {
                this.attackPattern = attackPattern;
                this.showTooltip(selection.event);
            } else {
                this.hideTooltip();
            }
        }
    }

    /**
     * @description creates the overlay for the tooltip
     */
    private showTooltip(event: UIEvent) {
        if (!this.overlayRef) {
            const elem = new ElementRef(event.target);

            const positionStrategy = this.overlay.position()
              .connectedTo(elem,
                {originX: 'center', originY: 'bottom'},
                {overlayX: 'start', overlayY: 'top'})
              .withFallbackPosition(
                {originX: 'center', originY: 'top'},
                {overlayX: 'start', overlayY: 'bottom'})
              .withFallbackPosition(
                {originX: 'center', originY: 'bottom'},
                {overlayX: 'end', overlayY: 'top'})
              .withFallbackPosition(
                {originX: 'center', originY: 'bottom'},
                {overlayX: 'end', overlayY: 'bottom'});

            this.overlayRef = this.overlay.create({
                minWidth: 300,
                maxWidth: 500,
                hasBackdrop: false,
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.reposition()
            });

            const sub$ = this.overlayRef.backdropClick()
                .finally(() => sub$.unsubscribe())
                .subscribe(
                    () => this.hideTooltip(),
                    (err) => console.log(err));

            this.portal = new TemplatePortal(this.tooltipTemplate, this.vcr);
        }

        this.overlayRef.attach(this.portal);
    }

    /**
     * @description hides the tooltip overlay
     */
    private hideTooltip() {
        this.attackPattern = null;
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    /**
     * @description for selecting and deselecting attack patterns
     */
    public toggleAttackPattern(clicked?: any) {
        if (clicked && clicked.row) {
            const index = this.selectedPatterns.findIndex(pattern => pattern.id === clicked.row.id);
            let newValue = 'selected';
            if (index < 0) {
                // pattern was not previously selected; select it
                this.selectedPatterns.push(clicked.row);
            } else {
                // remove the pattern from our selection list
                newValue = 'inactive';
                this.selectedPatterns.splice(index, 1);
            }
            this.heatmap.forEach(batch => {
                batch.cells.forEach(cell => {
                    if (cell.title === clicked.row.title) {
                        cell.value = newValue;
                    }
                });
                return batch;
            });
            this.heatmapView.updateCells();
        }
    }

    /**
     * @description retrieve the list of selected attack pattern names
     */
    public close(): string[] {
        return Array.from(new Set(this.selectedPatterns.map(pattern => pattern.id)));
    }
  
}