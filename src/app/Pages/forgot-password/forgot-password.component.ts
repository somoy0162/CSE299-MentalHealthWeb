import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { SecurityService } from '../../Common/service/security.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DataService } from '../../Common/service/data.service';
import { FormsModule } from '@angular/forms';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { SharedModule } from '../../Common/shared/shared.module';

@Component({
	selector: 'app-forgot-password',
	standalone: true,
	imports: [
		RouterLink,
		RouterModule,
		FormsModule,
		SharedModule
	],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
	private destroy: Subject<void> = new Subject<void>();
	email: any;
	userName: string = '';
	emailSendSuccess: boolean = false;
	successText: string = '';

	constructor(
		private messageHelperService: MessageHelperService,
		private securityService: SecurityService,
		private location: Location,
		private router: Router,
		public dataService: DataService
	) {
	}

	ngOnInit(): void {
	}

	goback() {
		this.location.back();
	}

	onEmailSubmit() {
		if (!this.userName) {
			this.messageHelperService.showMessage(ResponseStatus.warning, "Must be enter username");
			return;
		}
		this.securityService
			.mailSentforgotPassword(this.userName)
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
				}
				this.messageHelperService.showMessage(response.ResponseCode, response.Message);
			});
	}


	clickContinue() {
		this.router.navigateByUrl('login');
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}