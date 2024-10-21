import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpHelper: HttpHelper) { }

  getAllRole() {
    const url = 'api/role/GetAllRole'
    return this.httpHelper.getHelper(url);
  }
}
