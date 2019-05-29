import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordInitPage } from './word-init.page';

describe('WordInitPage', () => {
  let component: WordInitPage;
  let fixture: ComponentFixture<WordInitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordInitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordInitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
