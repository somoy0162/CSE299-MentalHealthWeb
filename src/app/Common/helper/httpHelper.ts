import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, timeout } from 'rxjs/operators';
import { finalize } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';
import { LocalstoreService } from '../service/localstore.service';
import { Router } from '@angular/router';
import { MessageHelperService } from './message-helper.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: "root" })
export class HttpHelper {
	static numberOfRequest = 0;
	private timeOutTime = 1000000;
	constructor(
		private httpClient: HttpClient,
		private localStoreService: LocalstoreService,
		private router: Router,
		private messageHelper: MessageHelperService
	) { }

	postHelper(url: string, obj: any = {}): Observable<any> {
		HttpHelper.numberOfRequest++;
		const user: any = JSON.parse(localStorage.getItem("User") ?? '{}');
		return this.httpClient.post(environment.BASE_URL + url, this.transformFilterModel(obj), {
			headers: new HttpHeaders({
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: user?.Token ?? "",
			})
		})
			.pipe(timeout(this.timeOutTime))
			.pipe(map((value: any) => value,
				(error: HttpErrorResponse) => {
					this.handleError(error);
				})).pipe(catchError(this.handleError.bind(this)))
			.pipe(finalize(() => {
				HttpHelper.numberOfRequest--;
			}));
	}

	getHelper(url: string): Observable<any> {
		HttpHelper.numberOfRequest++;
		const user: any = JSON.parse(localStorage.getItem("User") ?? '{}');
		return this.httpClient.get(environment.BASE_URL + url, {
			headers: new HttpHeaders({
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: user?.Token ?? "",
			})
		})
			.pipe(timeout(this.timeOutTime))
			.pipe(map((value: any) => {
				return value;
			}, (error: HttpErrorResponse) => {
				this.handleError(error);
			})).pipe(catchError(this.handleError.bind(this)))
			.pipe(finalize(() => {
				HttpHelper.numberOfRequest--;
			}));
	}

	getExportHelper(url: string): Observable<any> {
		HttpHelper.numberOfRequest++;
		const user: any = JSON.parse(localStorage.getItem("User") ?? '{}');
		return this.httpClient.get(environment.BASE_URL + url, {
			headers: new HttpHeaders({
				'Content-Type': 'application/pdf',
				'Accept': 'application/pdf',
				Authorization: user?.Token ?? "",
			}),
			observe: "response",
			responseType: "blob"
		})
			.pipe(timeout(this.timeOutTime))
			.pipe(map((value: any) => value,
				(error: HttpErrorResponse) => {
					this.handleError(error);
				})).pipe(catchError(this.handleError.bind(this)))
			.pipe(finalize(() => {
				HttpHelper.numberOfRequest--;
			}));
	}

	private handleError(error: HttpErrorResponse) {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		if (HttpHelper.numberOfRequest == 1) {
			if (error.status == 401) {
				this.messageHelper.showMessage(1000, "Session Timeout. Please Log in Again");
				this.localStoreService.removeToken();
				this.router.navigate(['/login']);
			} else if (error.message == 'Timeout has occurred') {
				this.messageHelper.showMessage(1000, "response time out");
			} else {
				this.messageHelper.showMessage(1000, "error connection");
			}
		}
		return throwError(() => {
			new Error(error.error);
		});
	}

	/**
	 * 
	 * @param body 
	 * @returns 
	 */
	private transformFilterModel(body: any): any {
		if (body.filterModel) {
			let filterModels: any[] = [];
			Object.keys(body.filterModel).forEach((key) => {
				const filter = body.filterModel[key];
				let objFilter = { colId: key, filterType: filter.filterType, operator: filter.operator };
				if (filter.filterType === "multi") {
					const models: any[] = [];
					filter.filterModels.map((nextFilter: any) => {
						if (nextFilter) {
							models.push(nextFilter);
						}
					});
					filterModels.push({ ...objFilter, filters: models });
				} else if (filter.filterType === "set") {
					filterModels.push({ ...objFilter, filters: [{ ...filter }] });
				} else {
					const models: any[] = [];
					if (filter.condition1) {
						models.push(filter.condition1);
					}
					if (filter.condition2) {
						models.push(filter.condition2);
					} else {
						models.push(filter);
					}
					filterModels.push({ ...objFilter, filters: models });
				}
			});
			body.filterModel = filterModels;
		}
		return body;
	}
}
