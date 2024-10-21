import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
	HttpHeaders
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalstoreService } from '../service/localstore.service';
import { MessageHelperService } from '../helper/message-helper.service';
import { DataService } from '../service/data.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpClientInterceptor implements HttpInterceptor {

	httpHeader: HttpHeaders | undefined;
	
	constructor(
		private router: Router,
		private notifier: MessageHelperService,
		private localStoreService: LocalstoreService,
		private dataService: DataService,
		private modalService: BsModalService,
	) { }

	showHttpErrorOnTrayMessage(message: string) {
		this.notifier.showMessage(404, '');
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let authToken = this.localStoreService.getToken();
		if (authToken != null && authToken != "") {
			authToken = `Bearer ${authToken}`;
		}

		let url = request.url;
		if (!(url.startsWith("https://") || url.startsWith("http://") || url.endsWith(".json"))) {
			url = environment.BASE_URL + request.url;
			this.httpHeader = request.headers.set('Authorization', `${authToken}`);
		} else {
			this.httpHeader = request.headers.delete("Authorization");
		}

		const reqClone = request.clone({ url, headers: this.httpHeader });

		return next.handle(reqClone).pipe(map((event) => {
			if (event instanceof HttpResponse) {
				const responseData = event.body;
				if (!responseData || !responseData.isSuccess) {
					// const message = responseData.message;
					// if (request.url.indexOf("csv") < 0) {
					//   this.showHttpErrorOnTrayMessage(message);
					// }
				}
			}
			return event;
		}),
			catchError((err: HttpErrorResponse) => {
				if (err.status === 401 && err.url?.includes(environment.BASE_URL)) {
					this.showHttpErrorOnTrayMessage(err.error.message);
					this.localStoreService.removeToken();
					var modalCount = this.modalService.getModalsCount();
					if (modalCount > 0) {
						for (let i = 1; i <= modalCount; i++) {
							this.modalService.hide(i);
						}
					}
					this.router.navigate(["/login"]);
					window.location.reload();
				} else {
					this.showHttpErrorOnTrayMessage(err.error);
				}

				return throwError(() => err);
			}),
			finalize(() => {
				this.dataService.destroyForm.next(null);
			}));
	}
}
