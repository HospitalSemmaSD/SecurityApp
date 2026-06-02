import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'app-theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Leer el tema guardado en localStorage o usar la preferencia del sistema
    const savedTheme = localStorage.getItem(this.themeKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const startDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
    this.isDarkMode.set(startDark);
    this.applyTheme(startDark);
  }

  toggleTheme() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem(this.themeKey, newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  private applyTheme(isDark: boolean) {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.setAttribute('data-bs-theme', 'light');
    }
  }
}
