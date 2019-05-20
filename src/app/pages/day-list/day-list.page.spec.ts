import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayListPage } from './day-list.page';

describe('DayListPage', () => {
  let component: DayListPage;
  let fixture: ComponentFixture<DayListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
