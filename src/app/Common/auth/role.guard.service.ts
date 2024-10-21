import { AuthGuardService } from './auth.guard.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class RoleGuardService implements CanActivate {

  private roles = [];
  constructor(public auth: AuthGuardService, public router: Router) { }


  getAllRoles() {
    //this.roles = ['H'];
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {



    let url = this.router.url.split('/')[1];
    // this will be passed from the route config
    // on the data property
    // const expectedRole = route.data.expectedRole;

    // const token = localStorage.getItem('token');

    // decode the token to get its payload
    // const tokenPayload = decode(token);
    if (!this.auth.isLoggedIn) {// || "admin" !== expectedRole
      //  this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
