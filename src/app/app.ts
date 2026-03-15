import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Theme, ThemeService } from './services/theme.service';
import { SinglePackageCard } from './components/single-package-card/single-package-card.component';
import { SinglePackage } from './interfaces/single-package';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, SinglePackageCard],
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
    { id: '@fastify/cookie', weeklyDownloads: 50234, dependencyCount: 5 },
    { id: '@angular/core', weeklyDownloads: 1234567, dependencyCount: 12 },
    { id: 'rxjs', weeklyDownloads: 987654, dependencyCount: 3 },
    { id: 'typescript', weeklyDownloads: 2345678, dependencyCount: 0 },
    { id: '@nestjs/common', weeklyDownloads: 345678, dependencyCount: 8 },
    { id: 'lodash', weeklyDownloads: 876543, dependencyCount: 2 }
  ];
  packages = signal<SinglePackage[]>(this.dummyPackages);

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
}
