/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageStateComponent } from './page-state.component';

describe('PageStateComponent', () => {
  let fixture: ComponentFixture<PageStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageStateComponent);
  });

  it('renders an error retry action', () => {
    const component = fixture.componentInstance;
    component.kind = 'error';
    component.title = 'Request failed';
    component.message = 'Try again.';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Request failed');
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });
});
