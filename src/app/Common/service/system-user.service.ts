import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class SystemUserService {

  constructor(private httpHelper: HttpHelper) { }

  getAllSystemUser() {
    const url = 'api/systemUser/GetAllSystemUser'
    return this.httpHelper.getHelper(url);
  }

  saveSystemUser(obj: any) {
    const url = 'api/systemUser/SaveSystemUser'
    return this.httpHelper.postHelper(url, obj);
  }

  deleteSystemUserById(userID: number) {
    const url = 'api/systemUser/DeleteSystemUserById/' + userID;
    return this.httpHelper.getHelper(url);
  }
}
