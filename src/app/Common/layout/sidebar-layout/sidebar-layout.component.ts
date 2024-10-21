import { Component, ElementRef, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from '../../enums/appEnums';
import { MessageHelperService } from '../../helper/message-helper.service';
import { DataService } from '../../service/data.service';
import { LocalstoreService } from '../../service/localstore.service';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../service/security.service';
import { Permission } from '../../../Model/permission';
@Component({
	selector: 'app-sidebar-layout',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, CommonModule],

	templateUrl: './sidebar-layout.component.html',
	styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent implements OnInit {

	@ViewChild('dropSearchInput') dropSearchInput: ElementRef | undefined;

	private destroy: Subject<void> = new Subject<void>();
	isDropup: boolean = true;
	isPatientMenu: boolean = false;
	isAideMenu: boolean = false;
	profileImgText: string = '';
	profileUserName: string = '';
	sidebarToggle: boolean = false;
	sidehamberger: boolean = false;
	menuStates: boolean[] = [false, false, false, false];
	timer: any;
	isExpandAccountRecieve: boolean = false;
	permissions: Permission[] = [];

	constructor(
		private router: Router,
		private messageHelperService: MessageHelperService,
		private securityService: SecurityService,
		public dataService: DataService,
		private localStoreService: LocalstoreService,
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private readonly localStorage: LocalstoreService
	) {
	}

	ngOnInit() {
		this.toggleSideBar();
		setTimeout(() => {
			this.getUserProfileText();
			this.permissions = this.localStorage.getData('Permissions');
		}, 500);
	}

	logout() {
		this.securityService.logout()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.router.navigateByUrl('/login');
					this.localStoreService.removeAll();
				} else {
					this.messageHelperService.showMessage(response.ResponseCode, response.Message);
				}
			});
	}

	toggleSideBar(): void {
		this.dataService.isSidebarToggle
			.pipe(takeUntil(this.destroy))
			.subscribe((isToggle: boolean) => {
				this.sidebarToggle = isToggle;
			});
	}

	private _index: number = -1;
	// toggleMenu(index: number): void {
		
		
	// 	 this.menuStates[index] = !this.menuStates[index];
		
	// }


	toggleMenu(index: number): void {
		if (this.menuStates[index]) {
		  this.menuStates[index] = false;
		} else {
		  this.menuStates = this.menuStates.map((_, i) => i === index);
		}
	  }
	

	getUserProfileText() {
		let text = this.localStoreService.getData('User').UserName;
		this.profileImgText = text[0].toUpperCase();
		this.profileUserName = text;
	}


	toggleDropdown(event: Event) {
		event.stopPropagation(); // Prevent event bubbling
		const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-menu');
		if (dropdown.classList.contains('show')) {
			this.renderer.removeClass(dropdown, 'show');
		} else {
			this.renderer.addClass(dropdown, 'show');
		}
	}

	isPermited(permitName: string): boolean {
		return this.permissions.some((x: Permission) => x.PermissionName == permitName);
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
