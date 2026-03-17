import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SinglePackageCard } from './single-package-card.component';
import { PackageSummary } from '../../interfaces/package-summary.interface';

describe('SinglePackageCard (Vitest)', () => {
  let fixture: any;
  let component: SinglePackageCard;

  const mockPackage: PackageSummary = {
    id: 'rxjs',
    weeklyDownloads: 876543,
    dependencyCount: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePackageCard]
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePackageCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('pkg', mockPackage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit hoverStart on mouseenter when not disabled', () => {
    const spy = vi.spyOn(component.hoverStart, 'emit');

    fixture.debugElement.triggerEventHandler('mouseenter', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit hoverEnd on mouseleave when not disabled', () => {
    const spy = vi.spyOn(component.hoverEnd, 'emit');

    fixture.debugElement.triggerEventHandler('mouseleave', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit hoverStart when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const spy = vi.spyOn(component.hoverStart, 'emit');

    fixture.debugElement.triggerEventHandler('mouseenter', {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply the disabled class to the host element', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const host = fixture.debugElement.nativeElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('should format downloads as K when >= 1000', () => {
    expect(component.formattedDownloads).toBe('876K');
  });

  it('should return null scope and full name for unscoped packages', () => {
    fixture.componentRef.setInput('pkg', { id: 'lodash', weeklyDownloads: 100, dependencyCount: 0 });
    fixture.detectChanges();

    expect(component.scope).toBeNull();
    expect(component.name).toBe('lodash');
  });

  it('should split scoped package names correctly', () => {
    fixture.componentRef.setInput('pkg', { id: '@angular/core', weeklyDownloads: 100, dependencyCount: 0 });
    fixture.detectChanges();

    expect(component.scope).toBe('@angular');
    expect(component.name).toBe('core');
  });
});
