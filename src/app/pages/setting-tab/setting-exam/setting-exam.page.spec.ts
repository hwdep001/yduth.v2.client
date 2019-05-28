import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingExamPage } from './setting-exam.page';

describe('SettingExamPage', () => {
  let component: SettingExamPage;
  let fixture: ComponentFixture<SettingExamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingExamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingExamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
