import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { SecurityService } from '../../Common/service/security.service';
import { VMRegister } from '../../VM/vmRegister';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { SharedModule } from '../../Common/shared/shared.module';


@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		RouterLink,
		RouterModule,
		CommonModule,
		FormsModule,
		SharedModule
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	private destroy: Subject<void> = new Subject<void>();
	isShowPassword: boolean = false;
	objVmRegister: VMRegister = new VMRegister()
	isLoading: boolean = false;

	constructor(
		private messageHelperService: MessageHelperService,
		private securityService: SecurityService,
		private router: Router,
		private readonly location: Location
	) { }

	ngOnInit() {
	}

	onSubmit() {
		this.isLoading = true;
		this.securityService.register(this.objVmRegister)
			.pipe(takeUntil(this.destroy))
			.pipe(finalize(() => this.isLoading = false))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.messageHelperService.showMessage(ResponseStatus.success, response.Message);
					this.objVmRegister = new VMRegister();
					this.router.navigateByUrl('login');
				} else {
					this.messageHelperService.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	goback() {
		this.location.back();
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
