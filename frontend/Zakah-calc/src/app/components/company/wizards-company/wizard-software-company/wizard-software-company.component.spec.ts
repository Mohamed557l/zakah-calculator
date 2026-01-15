/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WizardSoftwareCompanyComponent } from './wizard-software-company.component';

describe('WizardSoftwareCompanyComponent', () => {
  let component: WizardSoftwareCompanyComponent;
  let fixture: ComponentFixture<WizardSoftwareCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardSoftwareCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardSoftwareCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
