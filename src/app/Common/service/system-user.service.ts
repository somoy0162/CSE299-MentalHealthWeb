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

  updatePersonalDetails(obj: any) {
    const url = 'api/systemUser/UpdatePersonalDetails'
    return this.httpHelper.postHelper(url, obj);
  }

  updatePassword(obj: any) {
    const url = 'api/systemUser/UpdatePassword'
    return this.httpHelper.postHelper(url, obj);
  }

  getAllGender() {
    const url = 'api/systemUser/GetAllGender'
    return this.httpHelper.getHelper(url);
  }
}
