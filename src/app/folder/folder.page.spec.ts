import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

import { FolderPage } from './folder.page';

describe('FolderPage', () => {
  let component: FolderPage;
  let fixture: ComponentFixture<FolderPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [FolderPage],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
