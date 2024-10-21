import { Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { RouterOutlet } from '@angular/router';
import { SidebarLayoutComponent } from '../sidebar-layout/sidebar-layout.component';
import { HeaderLayoutComponent } from '../header-layout/header-layout.component';
import { CommonModule } from '@angular/common';
import { setTheme } from 'ngx-bootstrap/utils';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressHttp } from 'ngx-progressbar/http';

@Component({
	selector: 'app-home-layout',
	standalone: true,
  imports: [
	RouterOutlet, 
	SidebarLayoutComponent,
	HeaderLayoutComponent,
	CommonModule,
	NgProgressbar, 
	NgProgressHttp
],
	template: `
		<app-sidebar-layout></app-sidebar-layout>
		<app-header-layout [class.header-expand]="dataService.isSidebarToggle" ></app-header-layout>
		<main>
		<ng-progress id="progressBar"></ng-progress>
			<div class="main-content" [class.main-content-extend]="dataService.isSidebarToggle">
				<router-outlet />
				
			</div>
		</main>
	`
})
export class HomeLayoutComponent {

	constructor(
		public dataService: DataService
	) {
		setTheme("bs5");
	 }
}
