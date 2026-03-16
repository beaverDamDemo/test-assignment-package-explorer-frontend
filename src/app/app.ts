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
  loading = true;
  currentTheme: Theme = 'light';
  private readonly themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  packages = signal<PackageSummary[]>([]);
  hoveredPackage = signal<string | null>(null);
  highlightedDependencies = signal<Set<string>>(new Set());
  readonly skeletonItems = Array.from({ length: 6 }, (_, i) => i);
  filterText = signal('');
  private dependencyCache = new Map<string, string[]>();
  filteredPackages = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    if (!text) return this.packages();
    return this.packages().filter(p =>
      p.id.toLowerCase().includes(text) ||
      p.id.split('/').pop()?.toLowerCase().includes(text)
    );
  });

  constructor(private packagesService: Packages) { }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.packagesService.getAll().subscribe(packages => {
      this.packages.set(packages);

      packages.forEach(pkg => {
        this.packagesService.getDependencies(pkg.id).subscribe(deps => {
          this.dependencyCache.set(pkg.id, deps);
          console.log(`🎉 ~ Dependencies preloaded for ${pkg.id}:`, deps);
        });
      });

      this.loading = false;
    });
  }

  onHoverStart(pkg: PackageSummary) {
    this.hoveredPackage.set(pkg.id);

    const deps = this.dependencyCache.get(pkg.id);

    if (deps) {
      console.log(`🎉 ~ Dependencies already loaded for ${pkg.id}:`, deps);
      this.highlightedDependencies.set(new Set(deps));
    } else {
      console.log(`🎉 ~ Dependencies NOT loaded yet for ${pkg.id}`);
      this.highlightedDependencies.set(new Set());
    }
  }

  onHoverEnd() {
    this.hoveredPackage.set(null);
    this.highlightedDependencies.set(new Set());
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
