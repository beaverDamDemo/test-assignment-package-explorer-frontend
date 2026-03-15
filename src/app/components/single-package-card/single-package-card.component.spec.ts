import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglePackageCard } from './single-package-card.component';
import { PackageSummary } from '../../interfaces/package-summary.interface';

describe('SinglePackageCard', () => {
  let component: SinglePackageCard;
  let fixture: ComponentFixture<SinglePackageCard>;

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

    component.pkg = mockPackage;
    component.isHovered = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
