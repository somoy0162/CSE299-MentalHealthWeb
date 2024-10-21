import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Common/shared/shared.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink, 
		RouterLinkActive,
		CommonModule,
		SharedModule
	],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {

	private destroy: Subject<void> = new Subject<void>();

	constructor(
		private headerService: HeaderService
	) {
	}

	ngOnInit(): void {
		Promise.resolve().then(() => this.headerService.setTitle('Settings'));
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
