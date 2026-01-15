/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeftSectionViewComponent } from './left-section-view.component';

describe('LeftSectionViewComponent', () => {
  let component: LeftSectionViewComponent;
  let fixture: ComponentFixture<LeftSectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
