import { Injectable } from '@angular/core';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private httpHelper: HttpHelper
  ) { }

  getAllFiles() {
    const url = 'api/Resources/GetAllFiles'
    return this.httpHelper.getHelper(url);
  }

  downloadFile(id: number) {
    const url = 'api/Resources/DownloadFile/' + id;
    return this.httpHelper.getExportHelper(url);
  }
  deleteima(id: number) {
    const url = 'api/Resources/DeleteFile/' + id;
    return this.httpHelper.getHelper(url);
  }

}
