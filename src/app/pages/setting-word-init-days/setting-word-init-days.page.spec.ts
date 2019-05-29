import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingWordInitDaysPage } from './setting-word-init-days.page';

describe('SettingWordInitDaysPage', () => {
  let component: SettingWordInitDaysPage;
  let fixture: ComponentFixture<SettingWordInitDaysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingWordInitDaysPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingWordInitDaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
