import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingWordPage } from './setting-word.page';

describe('SettingWordPage', () => {
  let component: SettingWordPage;
  let fixture: ComponentFixture<SettingWordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingWordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingWordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
