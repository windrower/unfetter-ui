import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Assess3Meta } from 'stix/assess/v3/assess3-meta';
import { AssessmentSet } from 'stix/assess/v3/baseline/assessment-set';
import * as assessActions from '../store/assess.actions';
import { LoadBaselines, UpdatePageTitle } from '../store/assess.actions';
import * as assessReducers from '../store/assess.reducers';
import * as assessSelectors from '../store/assess.selectors';
import { Assess3Form } from './assess3.form';

@Component({
  selector: 'unf-assess-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  public assessMeta: Assess3Meta;
  public form: FormGroup;
  public baselines: Observable<AssessmentSet[]>;
  public showToSelectBaselines = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    public store: Store<assessReducers.AssessState>,
  ) { }

  /**
   * @description
   */
  ngOnInit(): void {
    this.assessMeta = new Assess3Meta();
    this.resetForm();
    this.fetchData();
    this.listenForChanges();
  }

  /**
   * @description dispatch events to store
   * @returns void
   */
  public fetchData(): void {
    this.store.dispatch(new UpdatePageTitle(this.assessMeta.title));
    this.store.dispatch(new LoadBaselines());
  }

  /**
   * @description listen to redux store changes
   * @returns void
   */
  public listenForChanges(): void {
    this.baselines = this.store.select(assessSelectors.getSortedBaselines);
  }

  /**
   * @description for this component create and set a fresh assess form
   * @return {void}
   */
  public resetForm(event?: UIEvent): void {
    if (event) {
      event.preventDefault();
    }

    this.form = Assess3Form();
  }

  public disableContinue(): boolean {
    const assessmentTypeSelected = (this.assessMeta.includesIndicators || this.assessMeta.includesMitigations || this.form.get('baselineRef').value);
    return !this.form.get('title').value || !assessmentTypeSelected;
  }

  /**
   * @description
   * @return {void}
   */
  public submitForm(): void {
    this.updateMeta();
    this.store.dispatch(new assessActions.StartAssessment(this.assessMeta as any));
  }

  /**
   * @description
   * @param form 
   */
  private updateMeta() {
    this.assessMeta = this.formToAssessment(this.form);
  }

  /**
   * @description
   * @param form 
   */
  private formToAssessment(form: FormGroup): Assess3Meta {
    const assessment = Object.assign(new Assess3Meta(), form.value);
    return assessment;
  }

  /**
   * @description on cancel, go back a step in window history
   * @param {UIEvnent} optional event
   * @return {void}
   */
  public onCancel(event?: UIEvent): void {
    this.location.back();
  }

  /**
   * @description on title field blur update the assessment name
   * @param {UIEvnent} optional event
   * @return {void}
   */
  public onTitleBlur(event?: UIEvent): void {
    this.store.dispatch(new UpdatePageTitle(this.form.value.title));
  }

  /**
   * @description updates created_by_ref upon org selection changes
   * @param {orgId} string
   * @return {void}
   */
  public orgSelected(orgId: string): void {
    this.form.get('created_by_ref').patchValue(orgId);
  }

  /**
   * @description updates assessMeta upon selection of Indicators checkbox
   * @param {event} event
   * @return {void}
   */
  public indChange(event): void {
    this.updateMeta();
  }

  /**
   * @description updates assessMeta upon selection of Mitigations checkbox
   * @param {event} event
   * @return {void}
   */
  public mitChange(event): void {
    this.updateMeta();
  }

  public baselineChange(event): void {
    this.showToSelectBaselines = !this.showToSelectBaselines;
    if (!this.showToSelectBaselines) {
      this.form.get('baselineRef').patchValue(null);
    }
  }

  /**
   * @param  {string} baselineId
   * @returns void
   */
  public baselineSelected(baselineId: string): void {
    this.form.get('baselineRef').patchValue(baselineId);
  }

  /**
   * @description
   * @param index
   * @param item
   * @returns {number}
   */
  public trackByFn(index: number, item: any): number {
    return item || item.id || index;
  }
}
