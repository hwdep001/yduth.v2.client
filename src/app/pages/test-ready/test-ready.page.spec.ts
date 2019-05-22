import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReadyPage } from './test-ready.page';

describe('TestReadyPage', () => {
  let component: TestReadyPage;
  let fixture: ComponentFixture<TestReadyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestReadyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReadyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
