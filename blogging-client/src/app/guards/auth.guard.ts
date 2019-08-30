import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    redirectUrl: string;

    constructor(
        private authService: AuthorizationService,
        private router: Router
    ) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
