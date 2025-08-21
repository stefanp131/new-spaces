import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorScheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorScheme();
    this.updateBodyClass();
  }

  isDarkMode() {
    return this.colorScheme === 'dark';
  }

  private updateBodyClass() {
    this.renderer.removeClass(document.body, this.colorScheme === 'dark' ? 'light-theme' : 'dark-theme');
    this.renderer.addClass(document.body, `${this.colorScheme}-theme`);
  }

  private getColorScheme() {
    const storedScheme = localStorage.getItem('colorScheme');
    if (storedScheme) {
      this.colorScheme = storedScheme as 'light' | 'dark';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.colorScheme = 'dark';
    }
  }

  toggleTheme() {
    this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('colorScheme', this.colorScheme);
    this.updateBodyClass();
  }
}
