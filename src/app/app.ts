import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Theme, ThemeService } from './services/theme.service';
import { SinglePackageCard } from './components/single-package-card/single-package-card.component';
import { Packages } from './services/packages.service';
import { PackageSummary } from './interfaces/package-summary.interface';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    SinglePackageCard
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Package Explorer');
  currentTheme: Theme = 'light';
  private readonly themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  loading = true;
  packages = signal<PackageSummary[]>([]);
  hoveredPackage = signal<string | null>(null);
  highlightedDependencies = signal<Set<string>>(new Set());
  filterText = signal('');
  filteredPackages = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    if (!text) return this.packages();
    return this.packages().filter(p =>
      p.id.toLowerCase().includes(text) ||
      p.id.split('/').pop()?.toLowerCase().includes(text)
    );
  });
  dependencies: string[] = [];

  constructor(private packagesService: Packages) { }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.packagesService.getAll().subscribe(data => {
      this.packages.set(data);
      this.loading = false;
    });
  }

  loadDependencies(id: string): void {
    this.packagesService.getDependencies(id).subscribe(deps => {
      this.dependencies = deps;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onHoverStart(pkg: PackageSummary) {
    this.hoveredPackage.set(pkg.id);
    this.highlightedDependencies.set(new Set());
  }

  onHoverEnd() {
    this.hoveredPackage.set(null);
    this.highlightedDependencies.set(new Set());
  }
}
