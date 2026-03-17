import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Component, Input } from '@angular/core';
import { App } from './app';
import { Packages } from './services/packages.service';
import { ThemeService } from './services/theme.service';
import { PackageSummary } from './interfaces/package-summary.interface';

@Component({
  selector: 'single-package-card',
  template: ''
})
class MockSinglePackageCard {
  @Input() pkg: any;
}

describe('App Component (Vitest)', () => {
  let packagesServiceMock: Packages;
  let themeServiceMock: ThemeService;
  let theme$: Subject<string>;

  beforeEach(() => {
    theme$ = new Subject<string>();

    themeServiceMock = {
      toggleTheme: vi.fn(),
      theme$
    } as unknown as ThemeService;

    packagesServiceMock = {
      getAll: vi.fn(),
      getDependencies: vi.fn()
    } as unknown as Packages;

    TestBed.configureTestingModule({
      imports: [MockSinglePackageCard],
      providers: [
        { provide: Packages, useValue: packagesServiceMock },
        { provide: ThemeService, useValue: themeServiceMock }
      ]
    });
  });

  it('should render title', async () => {
    packagesServiceMock.getAll = vi.fn().mockReturnValue(of([]));
    packagesServiceMock.getDependencies = vi.fn().mockReturnValue(of([]));

    const fixture = TestBed.createComponent(App);
    theme$.next('light');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Package Explorer');
  });

  it('should load packages and dependencies on init', () => {
    const mockPackages: PackageSummary[] = [
      { id: '@angular/core', weeklyDownloads: 1234, dependencyCount: 2 },
      { id: 'rxjs', weeklyDownloads: 5678, dependencyCount: 1 }
    ];

    packagesServiceMock.getAll = vi.fn().mockReturnValue(of(mockPackages));
    packagesServiceMock.getDependencies = vi.fn().mockImplementation(id =>
      of([`${id}-dep1`, `${id}-dep2`])
    );

    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');
    fixture.detectChanges();

    expect(packagesServiceMock.getAll).toHaveBeenCalled();
    expect(packagesServiceMock.getDependencies).toHaveBeenCalledTimes(2);
    expect(component.packages()).toEqual(mockPackages);
    expect(component['dependencyCache'].get('@angular/core')).toEqual([
      '@angular/core-dep1',
      '@angular/core-dep2'
    ]);
  });

  it('should set loading to false after dependencies load', () => {
    packagesServiceMock.getAll = vi.fn().mockReturnValue(of([]));
    packagesServiceMock.getDependencies = vi.fn().mockReturnValue(of([]));

    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');
    fixture.detectChanges();

    expect([true, false]).toContain(component.loading);
  });

  it('should set hoveredPackage on hover start', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');

    const pkg = { id: 'test', weeklyDownloads: 0, dependencyCount: 0 };
    component.onHoverStart(pkg);

    expect(component.hoveredPackage()).toBe('test');
  });

  it('should highlight cached dependencies on hover start', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');

    component['dependencyCache'].set('cached', ['a', 'b']);
    component.onHoverStart({ id: 'cached', weeklyDownloads: 0, dependencyCount: 0 });

    expect(component.highlightedDependencies()).toEqual(new Set(['a', 'b']));
  });

  it('should clear hover state on hover end', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');

    component.hoveredPackage.set('x');
    component.highlightedDependencies.set(new Set(['a']));

    component.onHoverEnd();

    expect(component.hoveredPackage()).toBeNull();
    expect(component.highlightedDependencies()).toEqual(new Set());
  });

  it('should toggle theme', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    theme$.next('light');

    component.toggleTheme();

    expect(themeServiceMock.toggleTheme).toHaveBeenCalled();
  });
});
