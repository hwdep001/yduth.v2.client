import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWordsPage } from './search-words.page';

describe('SearchWordsPage', () => {
  let component: SearchWordsPage;
  let fixture: ComponentFixture<SearchWordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWordsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
