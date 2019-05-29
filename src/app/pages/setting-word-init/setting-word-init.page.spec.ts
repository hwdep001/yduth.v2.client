import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingWordInitPage } from './setting-word-init.page';

describe('SettingWordInitPage', () => {
  let component: SettingWordInitPage;
  let fixture: ComponentFixture<SettingWordInitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingWordInitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingWordInitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
