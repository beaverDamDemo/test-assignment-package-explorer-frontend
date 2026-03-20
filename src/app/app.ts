import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { Theme, ThemeService } from './services/theme.service';
import { SinglePackageCard } from './components/single-package-card/single-package-card.component';
import { Packages } from './services/packages.service';
import { PackageSummary } from './interfaces/package-summary.interface';
import { catchError, forkJoin, finalize, map, of, switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    SinglePackageCard,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('Package Explorer');
  loading = signal(true);
  dependenciesLoading = signal(true);
  currentTheme: Theme = 'light';
  private readonly themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
  packages = signal<PackageSummary[]>([]);
  errorMessage = signal<string | null>(null);
  hasLoaded = signal(false);
  hoveredPackage = signal<string | null>(null);
  highlightedDependencies = signal<Set<string>>(new Set());
  readonly skeletonItems = Array.from({ length: 6 }, (_, i) => i);
  filterText = signal('');
  private dependencyCache = new Map<string, string[]>();
  sortMode = signal<'alpha' | 'downloads' | 'deps'>('alpha');

  filteredPackages = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    const mode = this.sortMode();
    let list = this.packages();

    if (text) {
      list = list.filter(p =>
        p.id.toLowerCase().includes(text) ||
        p.id.split('/').pop()?.toLowerCase().includes(text)
      );
    }

    if (mode === 'alpha') {
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    } else if (mode === 'downloads') {
      list = [...list].sort((a, b) => b.weeklyDownloads - a.weeklyDownloads);
    } else if (mode === 'deps') {
      list = [...list].sort((a, b) => b.dependencyCount - a.dependencyCount);
    }

    return list;
  });

  constructor(private packagesService: Packages, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.loadAll();
  }

  private loadAll() {
    this.loading.set(true);
    this.dependenciesLoading.set(true);
    this.errorMessage.set(null);
    this.hasLoaded.set(false);

    this.packages.set([]);
    this.dependencyCache.clear();

    this.packagesService.getAll().pipe(
      switchMap(packages => {
        this.packages.set(packages);

        const dependencyCalls = packages.map(pkg =>
          this.packagesService.getDependencies(pkg.id).pipe(
            map(deps => ({ id: pkg.id, deps })),
            catchError((err: unknown) => {
              const message = err instanceof Error ? err.message : String(err);

              console.log(
                `%c✖ Failed to load dependencies for ${pkg.id}: ${message}`,
                'color:#F44336; font-weight:bold;'
              );

              // this.snackBar.open(`Failed to load ${pkg.id} dependencies`, 'OK', {
              //   duration: 2000
              // });

              return of({ id: pkg.id, deps: [] });
            })
          )
        );

        return forkJoin(dependencyCalls).pipe(
          catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);

            console.log(
              `%c✖ Global dependency loading failure: ${message}`,
              'color:#F44336; font-weight:bold;'
            );

            // this.snackBar.open('Failed to load dependencies', 'OK', {
            //   duration: 2000
            // });

            this.errorMessage.set('Failed to load dependency details.');
            this.dependenciesLoading.set(false);
            return of([]);
          })
        );
      }),
      catchError((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);

        console.log(
          `%c✖ Failed to load packages: ${message}`,
          'color:#F44336; font-weight:bold;'
        );

        // this.snackBar.open('Failed to load packages', 'OK', {
        //   duration: 2000
        // });

        this.errorMessage.set('Unable to load packages. Please try again later.');

        return of(null);
      }),
      finalize(() => {
        this.loading.set(false);
        this.dependenciesLoading.set(false);
        this.hasLoaded.set(true);
      })
    ).subscribe(results => {
      if (!results) {
        return;
      }

      results.forEach(({ id, deps }) => {
        this.dependencyCache.set(id, deps);
      });

      this.dependenciesLoading.set(false);

      // this.snackBar.open('Dependencies loaded successfully!', 'OK', {
      //   duration: 1750
      // });
    });
  }

  reload() {
    this.loadAll();
  }

  onHoverStart(pkg: PackageSummary) {
    this.hoveredPackage.set(pkg.id);

    const deps = this.dependencyCache.get(pkg.id);

    if (deps) {
      this.highlightedDependencies.set(new Set(deps));
    } else {
      console.log(
        `%cDependencies NOT loaded yet for ${pkg.id}`,
        'color:#FF9800; font-weight:bold;'
      );
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
