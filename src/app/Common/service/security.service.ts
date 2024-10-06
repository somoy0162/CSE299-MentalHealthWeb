import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';
import { Observable } from 'rxjs';
import { VMForgotPassword } from '../../VM/VMForgotPassword';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private httpHelper: HttpHelper) { }

  login(obj: any): Observable<any> {
    const url = 'api/security/Login';
    return this.httpHelper.postHelper(url, obj);
  }

  logout(): Observable<any> {
    const url = 'api/security/Logout';
    return this.httpHelper.getHelper(url);
  }

  register(obj: any): Observable<any> {
    const url = 'api/security/Register';
    return this.httpHelper.postHelper(url, obj);
  }

  mailSentforgotPassword(userName: string) {
    const url = 'api/security/SendEmailForgotPassword/' + userName;
    return this.httpHelper.getHelper(url);
  }

  updatePassword(vmForgotPassword: VMForgotPassword) {
    const url = 'api/security/UpdatePassword';
    return this.httpHelper.postHelper(url, vmForgotPassword);
  }

  isPermitRegistration(): Observable<any> {
    const url = 'api/security/IsPermitRegistration';
    return this.httpHelper.getHelper(url);
  }

}
