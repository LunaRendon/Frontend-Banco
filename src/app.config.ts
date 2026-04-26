import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from 'src/app/core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

/**
 * app.config.ts CORREGIDO:
 * - Registra el authInterceptor con withInterceptors([authInterceptor])
 * - Esto inyecta el JWT en TODAS las peticiones HTTP al backend
 * - Sin esto, todas las rutas protegidas devuelven 401 "Autenticación requerida"
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        // CORRECCIÓN: usar withInterceptors en lugar de withInterceptorsFromDi
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } }
        })
    ]
};
