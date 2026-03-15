import { DOCUMENT, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private $currentTheme = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.$currentTheme.asObservable();
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    const theme = this.getThemeFromLocalStorage();
    this.setTheme(theme);
  }

  toggleTheme() {
    if (this.$currentTheme.value === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme) {
    this.$currentTheme.next(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
    this.setThemeInLocalStorage(theme);
  }

  getThemeFromLocalStorage(): Theme {
    return this.isBrowser
      ? (localStorage.getItem('preferred-theme') as Theme) ?? 'light'
      : 'light';
  }

  setThemeInLocalStorage(theme: Theme) {
    if (this.isBrowser) {
      localStorage.setItem('preferred-theme', theme);
    }
  }
}
