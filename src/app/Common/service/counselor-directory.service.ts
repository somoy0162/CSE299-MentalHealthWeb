import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class CounselorDirectoryService {

  constructor(private httpHelper: HttpHelper) { }

  getAllCounselor() {
    const url = 'api/counselorDirectory/GetAllCounselor'
    return this.httpHelper.getHelper(url);
  }
}
