import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayListModalPage } from './day-list-modal.page';

describe('DayListModalPage', () => {
  let component: DayListModalPage;
  let fixture: ComponentFixture<DayListModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayListModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayListModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
