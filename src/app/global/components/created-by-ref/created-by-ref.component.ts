import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../root-store/app.reducers';
import { Constance } from '../../../utils/constance';
import { BaseComponentService } from '../../../components/base-service.component';
import { RxjsHelpers } from '../../static/rxjs-helpers';
import { AssessmentMeta } from '../../../models/assess/assessment-meta';

@Component({
    selector: 'created-by-ref',
    templateUrl: 'created-by-ref.component.html'
})

export class CreatedByRefComponent implements OnInit {

    @Input() public model: any;
    @Input() public assessmentMeta: AssessmentMeta;
    @Output() public orgSelected: EventEmitter<String> = new EventEmitter<String>();
    public selected: string;
    public userOrgs$: Observable<any[]>;

    constructor(
        public store: Store<fromRoot.AppState>,
        private baseService: BaseComponentService
    ) { }

    public ngOnInit() { 
        const identityFilter = encodeURI(JSON.stringify({ 'stix.identity_class': 'organization' }));

        this.userOrgs$ = this.store.select('users')
            .filter((user: any) => user.userProfile && user.userProfile.organizations && user.userProfile.organizations.length)
            .pluck('userProfile')
            .pluck('organizations')
            .map((organizations: any[]) => {
                return organizations
                    .filter((org) => org.approved)
            })
            .switchMap((organizations: any[]) => {                
                return Observable.forkJoin(
                    Observable.of(organizations),
                    this.baseService.get(`${Constance.IDENTITIES_URL}?filter=${identityFilter}`)
                        .map(RxjsHelpers.mapArrayAttributes)
                );
            })
            .map(([organizations, identities]) => {
                return organizations.map((org) => {
                    const foundOrg = identities.find((identity) => identity.id === org.id);
                    if (foundOrg) {
                        return {
                            ...org,
                            name: foundOrg.name
                        };
                    } else {
                        return {
                            ...org,
                            name: 'Unknown'
                        };
                    }
                });
            })
            .do((organizations) => {
                if (organizations.length === 1) {
                    this.selected = organizations[0].id;
                }
            });
            
        if (this.assessmentMeta && this.assessmentMeta.created_by_ref && this.assessmentMeta.created_by_ref !== '') {
            this.selected = this.assessmentMeta.created_by_ref;
        }
    }

    public updateOrg(selectEvent: MatSelectChange) {
        if (this.model) {
            this.model.attributes.created_by_ref = selectEvent.value; 
        }

        if (this.assessmentMeta) {
            this.assessmentMeta.created_by_ref = selectEvent.value;
        }

        this.orgSelected.emit(selectEvent.value)
    }
}