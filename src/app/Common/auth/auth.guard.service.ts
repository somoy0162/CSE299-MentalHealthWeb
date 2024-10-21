import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { LocalstoreService } from '../service/localstore.service';
@Injectable({
	providedIn: 'root'
})
export class AuthGuardService {
	private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());

	constructor(
		private router: Router,
		private localStoreService: LocalstoreService,
		// private modalService: BsModalService
	) { }

	get isLoggedIn() {
		return this.loggedIn.asObservable();
	}

	setLoggedIn() {
		this.loggedIn.next(true);
	}

	logout(): void {
		this.localStoreService.removeAll();
		// var modalCount = this.modalService.getModalsCount();
		// if (modalCount > 0) {
		// 	for (let i = 1; i <= modalCount; i++) {
		// 		this.modalService.hide(i);
		// 	}
		// }
		this.router.navigate(['login']);
		this.loggedIn.next(false);
	}

	private hasToken(): boolean {
		return !!localStorage.getItem("Token");
	}
}
