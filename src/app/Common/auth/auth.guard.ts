import { AuthGuardService } from './auth.guard.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private authGuardService: AuthGuardService,
    ) { }

    canActivate(
        activeRouter: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {

        return this.authGuardService
            .isLoggedIn
            .pipe(
                map((isLoggedIn: boolean) => {
                    if (!isLoggedIn) {
                        this.authGuardService.logout();
                    }
                    return isLoggedIn;
                })
            );
    }
}
