import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../Common/shared/shared.module';
import { HeaderService } from '../../Common/service/header.service';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		CommonModule,
		SharedModule
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

	constructor(private headerService: HeaderService) {
	}

	ngOnInit(): void {
		Promise.resolve().then(() => this.headerService.setTitle('Dashboard'));
	}

	ngOnDestroy(): void {
	}
}
