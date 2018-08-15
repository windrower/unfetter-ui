import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CheckPII } from '../../static/check-pii';
import { debounceTime, map, tap } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'pii-check-message',
  templateUrl: './pii-check-message.component.html',
  styleUrls: ['./pii-check-message.component.scss']
})
export class PiiCheckMessageComponent implements OnInit {

  @Input() public formCtrl: FormControl;
  public piiWarnings$;
  public showWarnings = false;
  
  constructor() { }

  public ngOnInit() {
    this.piiWarnings$ = this.formCtrl.valueChanges
      .pipe(
        debounceTime(300),
        map((formVal) => CheckPII.validationErrors(formVal)),
        tap((warnings) => this.showWarnings = warnings.length > 0)
      )
  }
}
