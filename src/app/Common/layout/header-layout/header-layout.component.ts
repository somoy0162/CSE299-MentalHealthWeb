import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalstoreService } from '../../service/localstore.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from '../../enums/appEnums';
import { MessageHelperService } from '../../helper/message-helper.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { CommonModule } from '@angular/common';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
	selector: 'app-header-layout',
	standalone: true,
	imports: [
		CommonModule
	],
	templateUrl: './header-layout.component.html',
	styleUrls: ['./header-layout.component.css']
})
export class HeaderLayoutComponent implements OnInit {

	sidebarToggle: boolean = false;
	title: string = '';
	private destroy: Subject<void> = new Subject<void>();
	profileImhText!: string;

	constructor(
		private headerService: HeaderService,
		public dataService: DataService,
	) {
		setTheme("bs5");
	}

	ngOnInit() {
		this.headerService.title.subscribe(title => {
			this.title = title;
		});
	}

	onClickSidebarClose() {
		this.sidebarToggle = !this.sidebarToggle;
		this.dataService.isSidebarToggle.next(this.sidebarToggle);
	}

}
