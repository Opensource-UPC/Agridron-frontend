import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAppInitializer, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const SVG_ICONS = [
  'menu', 'home', 'farm', 'parcel', 'crop', 'mission', 'fumigation', 'analytics', 'drone', 'profile',
  'agrochemical', 'chevron-right', 'humidity', 'wind', 'precipitation', 'rain-probability', 'check-circle', 'alert',
  'lock', 'mail', 'eye', 'eye-off', 'role', 'logout',
  'plus', 'location', 'chevron-left', 'edit', 'trash', 'image', 'area', 'polygon'
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './asset/locales/', suffix: '.json' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.addLangs(['en', 'es']);

      const browserLang = translate.getBrowserLang();
      const selectedLang = browserLang && ['en', 'es'].includes(browserLang) ? browserLang : 'en';
      return firstValueFrom(translate.use(selectedLang));
    }),
    provideAppInitializer(() => {
      const iconRegistry = inject(MatIconRegistry);
      const sanitizer = inject(DomSanitizer);
      for (const icon of SVG_ICONS) {
        iconRegistry.addSvgIconInNamespace(
          'agd', icon, sanitizer.bypassSecurityTrustResourceUrl(`./asset/icons/${icon}.svg`)
        );
      }
    }),
  ]
};
