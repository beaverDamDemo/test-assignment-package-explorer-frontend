import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePackageCard } from './single-package-card.component';

describe('SinglePackageCard', () => {
  let component: SinglePackageCard;
  let fixture: ComponentFixture<SinglePackageCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePackageCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePackageCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
