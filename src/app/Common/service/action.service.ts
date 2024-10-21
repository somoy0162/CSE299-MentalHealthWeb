import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
		private httpHelper: HttpHelper
	) { }

  saveRoleActionMapping(obj: any) {
		const url = 'api/actions/SaveRoleActionMapping';
		return this.httpHelper.postHelper(url, obj);
	}
}
