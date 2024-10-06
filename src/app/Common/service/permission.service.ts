import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private httpHelper: HttpHelper) { }

  getAllPermission() {
    const url = 'api/permission/GetAllPermission'
    return this.httpHelper.getHelper(url);
  }

  getAllPermissionActionByRoleID(roleID: number) {
    const url = 'api/permission/GetAllPermissionActionByRoleID/' + roleID;
    return this.httpHelper.getHelper(url);
  }

  saveRolePermissionMapping(obj: any) {
    const url = 'api/Permission/SaveRolePermissionMapping';
    return this.httpHelper.postHelper(url, obj);
  }
}
