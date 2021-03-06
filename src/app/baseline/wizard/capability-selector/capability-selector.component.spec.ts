import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatButtonModule, MatCardModule, MatIconModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import * as fromRoot from 'app/root-store/app.reducers';
import { baselineReducer } from '../../../baseline/store/baseline.reducers';
import { CapabilitySelectorComponent } from './capability-selector.component';
import { FieldSortPipe } from '../../../global/pipes/field-sort.pipe';

describe('CapabilitySelectorComponent', () => {
  let component: CapabilitySelectorComponent;
  let fixture: ComponentFixture<CapabilitySelectorComponent>;

  const matModules = [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapabilitySelectorComponent, FieldSortPipe ],
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ...matModules,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'baseline': combineReducers(baselineReducer)
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapabilitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
