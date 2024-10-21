
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { SecurityService } from '../../Common/service/security.service';
import { VMForgotPassword } from '../../VM/VMForgotPassword';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Common/shared/shared.module';
@Component({
	selector: 'app-reset-password',
	standalone: true,
	imports: [
		RouterLink,
		RouterModule,
		FormsModule,
		CommonModule,
		SharedModule
	],
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	private destroy: Subject<void> = new Subject<void>();
	objreset: VMForgotPassword = new VMForgotPassword();
	resetToken: string;
	showSuccessMessage: boolean = false;
	vmForgotPassword: VMForgotPassword = new VMForgotPassword();

	constructor(
		private messageHelperService: MessageHelperService,
		private securityService: SecurityService,
		private activeRoute: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit(): void {
		this.vmForgotPassword.Token = this.activeRoute.snapshot.params['id'];
	}

	goback() {
		this.router.navigateByUrl('login');
	}

	onValidPasswordSubmit(): void {
		if (!this.vmForgotPassword.Password) {
			this.messageHelperService.showMessage(ResponseStatus.fail, "Password is Required");
			return;
		}
		if (this.vmForgotPassword.Password != this.vmForgotPassword.ConfirmPassword) {
			this.messageHelperService.showMessage(ResponseStatus.fail, "Confrim password & password doesn't match");
			return;
		}
		this.securityService
			.updatePassword(this.vmForgotPassword)
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.messageHelperService.showMessage(response.ResponseCode, response.Message);
					this.showSuccessMessage = true;
					this.router.navigateByUrl('login');
				} else {
					this.messageHelperService.showMessage(response.ResponseCode, response.Message);
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
