import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Theme, ThemeService } from './services/theme.service';
import { SinglePackageCard } from './components/single-package-card/single-package-card.component';
import { SinglePackage } from './interfaces/single-package';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, SinglePackageCard],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('angular-frontend');
  currentTheme: Theme = 'light';
  private readonly themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  loading = true;
  private readonly dummyPackages: SinglePackage[] = [
    {
      id: '@angular/core',
      weeklyDownloads: 1234567,
      dependencyCount: 2,
      dependencies: ['rxjs', 'tslib']
    },
    {
      id: '@angular/common',
      weeklyDownloads: 987654,
      dependencyCount: 1,
      dependencies: ['tslib']
    },
    {
      id: 'rxjs',
      weeklyDownloads: 876543,
      dependencyCount: 1,
      dependencies: ['tslib']
    },
    {
      id: 'tslib',
      weeklyDownloads: 2345678,
      dependencyCount: 0,
      dependencies: []
    },
    {
      id: 'express',
      weeklyDownloads: 345,
      dependencyCount: 1,
      dependencies: ['body-parser']
    },
    {
      id: 'body-parser',
      weeklyDownloads: 543,
      dependencyCount: 0,
      dependencies: []
    }
  ];
  packages = signal<SinglePackage[]>(this.dummyPackages);
  hoveredPackage = signal<string | null>(null);
  highlightedDependencies = signal<Set<string>>(new Set());

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    setTimeout(() => {
      this.packages = signal<SinglePackage[]>(this.dummyPackages);
    }, 1000);

    this.loading = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onHoverStart(pkg: SinglePackage) {
    this.hoveredPackage.set(pkg.id);
    this.highlightedDependencies.set(new Set(pkg.dependencies));
  }

  onHoverEnd() {
    this.hoveredPackage.set(null);
    this.highlightedDependencies.set(new Set());
  }
}
