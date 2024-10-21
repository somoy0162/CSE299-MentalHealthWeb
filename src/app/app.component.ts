import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderLayoutComponent } from './Common/layout/header-layout/header-layout.component';
import { SidebarLayoutComponent } from './Common/layout/sidebar-layout/sidebar-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderService } from './Common/service/header.service';
import { interceptorsLink } from './Common/interceptors/indexLink';
import { MessageHelperService } from './Common/helper/message-helper.service';
import { AuthGuard } from './Common/auth/auth.guard';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridLayoutComponent } from './Common/layout/ag-grid-layout/ag-grid-layout.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { RegisterComponent } from './Pages/register/register.component';
import { CustomDateFormatPipe } from './Common/pipes/datefilter.pipe';
import { ResponseStatus } from './Common/enums/appEnums';
import { Subject, takeUntil } from 'rxjs';
import { SecurityService } from './Common/service/security.service';
import { UserIdleService } from 'angular-user-idle';
import { setTheme } from 'ngx-bootstrap/utils';
import { SharedModule } from './Common/shared/shared.module';


@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		HeaderLayoutComponent,
		SidebarLayoutComponent,
		RouterOutlet,
		ReactiveFormsModule,
		BsDropdownModule,
		CommonModule,
		FormsModule,
		AgGridModule,
		HttpClientModule,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		RegisterComponent,
		AgGridLayoutComponent,
		SharedModule
	],
	providers: [
		interceptorsLink,
		MessageHelperService,
		HeaderService,
		AuthGuard,
		CustomDateFormatPipe,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'Counseling Center';
	private destroy: Subject<void> = new Subject<void>();

	constructor(
		private userIdleService: UserIdleService,
		private securityService: SecurityService,
		private router: Router
	) {
		setTheme('bs5');
	}

	ngOnInit(): void {
		this.userIdleService.startWatching();
		this.userIdleService.onTimerStart().subscribe((count: number) => { });
		this.userIdleService.onTimeout().subscribe(() => {
			this.securityService.logout()
				.pipe(takeUntil(this.destroy))
				.subscribe((response: any) => {
					if (response.ResponseCode == ResponseStatus.success) {
						Object.keys(localStorage).forEach(key => {
							if (!key.includes("ToolPanelColumnDefs")) {
								localStorage.removeItem(key);
							}
						});
						this.router.navigateByUrl('/login');
					}
				});
			this.userIdleService.stopWatching();
		});
	}
}
