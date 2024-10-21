import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Role } from '../../../../Model/role';
import { GridApi } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingSetupUserComponent } from '../../setting-setup-user.component';
import { Subject } from 'rxjs';


@Component({
	selector: 'app-action-cell-render',
	standalone: true,
	imports: [CommonModule,
		FormsModule],
	templateUrl: './action-cell-render.component.html',
	styleUrl: './action-cell-render.component.css'
})
export class ActionCellRenderComponent implements OnInit, OnDestroy {
	params: any;
	viewContainerRef: ViewContainerRef;
	gridApi: GridApi;
	destroy: Subject<void> = new Subject<void>();



	constructor(
		private settingSetupUserComponent: SettingSetupUserComponent
	) { }


	ngOnInit() {
	}
	agInit(params: any) {
		this.params = params;
	}

	editSystemUser() {
		this.settingSetupUserComponent.onAction('Edit', this.params.data);
	}

	deleteSystemUser() {
		this.settingSetupUserComponent.onAction('Delete', this.params.data);
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
