import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { VMLogin } from '../../VM/vmLogin';
import { LocalstoreService } from '../../Common/service/localstore.service';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { SecurityService } from '../../Common/service/security.service';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Common/shared/shared.module';
import { Permission } from '../../Model/permission';
import { AuthGuardService } from '../../Common/auth/auth.guard.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		RouterLink,
		RouterModule,
		FormsModule,
		CommonModule,
		SharedModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
	private destroy: Subject<void> = new Subject<void>();
	isRemindMeChecked: boolean = false;
	isShowPassword: boolean = false;
	isLoading: boolean = false;
	objVmLogin: VMLogin = new VMLogin();

	constructor(
		private securityService: SecurityService,
		private messageHelperService: MessageHelperService,
		private router: Router,
		private localStoreService: LocalstoreService,
		private authService: AuthGuardService
	) {
	}

	ngOnInit(): void {
		this.loadRemindMe();
		this.isPermitRegistration();
	}

	isRegisterPermitted: boolean = false;
	isPermitRegistration() {
		this.securityService.isPermitRegistration()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				this.isRegisterPermitted = response;
			});
	}

	permissions: Permission[] = [];
	onSubmit() {
		this.isLoading = true;
		this.localStoreService.removeAll();
		this.securityService.login(this.objVmLogin)
			.pipe(takeUntil(this.destroy))
			.pipe(finalize(() => this.isLoading = false))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.localStoreService.setData('Token', response.ResponseObj.vmLogin.Token);
					this.localStoreService.setData('User', response.ResponseObj.vmLogin);
					this.localStoreService.setData('Permissions', response.ResponseObj.permissions);
					this.authService.setLoggedIn();
					this.permissions = response.ResponseObj.permissions;
					if (this.permissions.length > 0) {
						setTimeout(() => this.router.navigate([this.permissions[0].PermissionName]), 1000);
					}
				} else {
					this.messageHelperService.showMessage(response.ResponseCode, response.Message);
				}
			});
	}

	checkRemindMe() {
		if (this.isRemindMeChecked) {
			sessionStorage.setItem('SavedUserName', this.objVmLogin.UserName);
		}
		else {
			sessionStorage.removeItem('SavedUserName');
		}
	}

	loadRemindMe() {
		const savedUserName = sessionStorage.getItem('SavedUserName');
		if (savedUserName) {
			this.isRemindMeChecked = true;
			this.objVmLogin.UserName = savedUserName;
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
