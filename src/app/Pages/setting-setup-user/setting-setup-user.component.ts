import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AgGridAngular } from "@ag-grid-community/angular";
import { HeaderService } from '../../Common/service/header.service';
import { Subject, takeUntil } from 'rxjs';
import {
	GridApi,
	IServerSideGetRowsParams,
	IServerSideDatasource,
	ModuleRegistry,
} from "@ag-grid-community/core";
import { AgGridLayoutComponent } from '../../Common/layout/ag-grid-layout/ag-grid-layout.component';
import { AgGridService } from '../../Common/service/ag-grid.service';
import { SharedModule } from '../../Common/shared/shared.module';
import { RoleCellRendererComponent } from './cellrender/role-cell-renderer/role-cell-renderer.component';
import { Role } from '../../Model/role';
import { ActionCellRenderComponent } from './cellrender/action-cell-render/action-cell-render.component';
import { ModalLayoutComponent } from '../../Common/layout/modal-layout/modal-layout.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoleService } from '../../Common/service/role.service';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { DataService } from '../../Common/service/data.service';
import { SecurityService } from '../../Common/service/security.service';
import { SystemUserService } from '../../Common/service/system-user.service';
import { LogInUser } from '../../Model/log-in-user';
import { PhoneNumberPipe } from '../../Common/pipes/PhoneNumber.pipe';

@Component({
	selector: 'app-setting-setup-user',
	standalone: true,
	imports: [RouterLink, RouterLinkActive,
		CommonModule,
		FormsModule,
		SharedModule,
		AgGridAngular,
		HttpClientModule,
		AgGridLayoutComponent,
		ModalLayoutComponent,
		RoleCellRendererComponent,

	],
	providers: [PhoneNumberPipe],
	templateUrl: './setting-setup-user.component.html',
	styleUrl: './setting-setup-user.component.css'
})
export class SettingSetupUserComponent implements OnInit, OnDestroy {
	@ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
	@ViewChild('systemUserDeleteModal', { read: TemplateRef }) systemUserDeleteModal: TemplateRef<any>;
	@ViewChild('roleFormTemplate', { read: TemplateRef }) roleTemplate: TemplateRef<any>;
	roleFormTitle: string = '';
	private destroy: Subject<void> = new Subject<void>();
	gridApi: GridApi;
	customFilterId: any;
	private settingmodalRef?: BsModalRef;

	constructor(
		private headerService: HeaderService,
		private aggridService: AgGridService,
		public dataService: DataService,
		private roleService: RoleService,
		private phoneNumberFormatterPipe: PhoneNumberPipe,
		private modalService: BsModalService,
		private messageHelperService: MessageHelperService,
		private systemUserService: SystemUserService
	) {

	}

	ngOnInit(): void {
		Promise.resolve().then(() => this.headerService.setTitle('Users'));
		this.getAllRole();
	}

	private _searchText: string = "";
	get searchText(): string {
		return this._searchText;
	}

	set searchText(value: string) {
		this._searchText = value;
		this.gridApi?.setGridOption('serverSideDatasource', this.defaultDataSource);
	}

	public columnDefs: any[] = [
		{
			...this.aggridService.createColumnDef("Name", "Name", "agTextColumnFilter"),
		},
		{
			...this.aggridService.createColumnDef("Email ", "Email", "agTextColumnFilter"),
		},
		{
			...this.aggridService.createColumnDef("Phone Number", "PhoneNumber", "agTextColumnFilter"),
			valueFormatter: (params: any) => this.phoneNumberFormatterPipe.transform(params?.data?.PhoneNumber),
		},
		{
			...this.aggridService.createColumnDef("Role", "RoleName", "agTextColumnFilter"),
			cellRendererParams: () => {
				return { roles: this.roles }
			},
			minWidth: 170,
		},
		{
			...this.aggridService.createColumnDef("Action", "action", "agTextColumnFilter"),
			cellRenderer: "actionCellRenderComponent", pinned: 'right',
			cellRendererParams: (params: any) => {
				return {
					viewContainerRef: this.viewContainerRef
				}
			}
		},
	];

	isEditMode: boolean = false;
	onAction(actionName: any, data: LogInUser = new LogInUser()) {
		if (actionName == 'Delete') {
			this.user = JSON.parse(JSON.stringify(data));
			this.settingmodalRef = this.modalService.show(this.systemUserDeleteModal);
			this.settingmodalRef?.setClass('delete-modal');
			return;
		}
		else if (actionName == 'Edit') {
			this.user = JSON.parse(JSON.stringify(data));
			this.settingmodalRef = this.modalService.show(this.roleTemplate);
			this.roleFormTitle = 'Edit Role';
			this.isEditMode = true;
		}
		else if (actionName == "Add New") {
			this.user = new LogInUser();
			this.roleFormTitle = 'Add New Role';
			this.settingmodalRef = this.modalService.show(this.roleTemplate);
		} else {
			this.settingmodalRef?.hide();
		}
	}

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	onRemoveUser(actionName: string, id: string) {
		if (actionName === 'Yes') {
			if (this.user.ID > 0) {
				this.systemUserService.deleteSystemUserById(this.user.ID)
					.pipe(takeUntil(this.destroy))
					.subscribe(response => {
						if (response.ResponseCode == ResponseStatus.success) {
							this.gridApi.refreshServerSide();
						}
						this.messageHelperService.showMessage(response.ResponseCode, response.Message);
						this.settingmodalRef?.hide();
					})
			} else {
				this.messageHelperService.showMessage(ResponseStatus.fail, "No data found to delete.");
			}
		} else {
			this.settingmodalRef?.hide();
		}
	}

	user: LogInUser = new LogInUser();
	onSubmitUserForm(actionName: string) {
		if (actionName === 'Save') {
			if (this.isValidUser()) {
				this.systemUserService.saveSystemUser(this.user)
					.pipe(takeUntil(this.destroy))
					.subscribe((response: any) => {
						this.messageHelperService.showMessage(response.ResponseCode, response.Message);
						if (response.ResponseCode == ResponseStatus.success) {
							this.user = new LogInUser();
							this.settingmodalRef?.hide();
							this.gridApi.refreshServerSide();
							this.isEditMode = false;
						}
					});
			}
		} else {
			this.user = new LogInUser();
			this.settingmodalRef?.hide();
			this.isEditMode = false;
		}
	}

	isValidUser(): boolean {
		if (this.isEditMode) {
			return true;
		}
		if (this.user.Name && this.user.UserName && this.user.Password && this.user.Role) {
			return true;
		}
		this.messageHelperService.showMessage(ResponseStatus.warning, "Fill up required fields.");
		return false;
	}

	public rowSelection: "single" | "multiple" = "multiple";
	gridOptions = {
		...this.aggridService.gridOptions,
		sideBar: {
			toolPanels: [
				{
					id: 'columns',
					labelDefault: 'Columns',
					labelKey: 'columns',
					iconKey: 'columns',
					toolPanel: 'agColumnsToolPanel',
					rowGroupPanelShow: 'always',
					minWidth: 225,
					maxWidth: 225,
					width: 225,
					toolPanelParams: {
						suppressRowGroups: true,
						suppressValues: true,
						suppressRowClickSelection: true,
						suppressPivots: true,
						suppressPivotMode: true,
						suppressColumnExpandAll: true,
					},
				}
			],
			position: 'right',
		},
		onGridReady: (e: any) => {
			this.gridApi = e.api;
			this.gridApi.setGridOption('serverSideDatasource', this.defaultDataSource,);
			e.api.sizeColumnsToFit();
			// this.expandCollapse();
		},
		components: {
			roleCellRendererComponent: RoleCellRendererComponent,
			actionCellRenderComponent: ActionCellRenderComponent,
		}
	}

	defaultDataSource: IServerSideDatasource = {
		getRows: (params: IServerSideGetRowsParams) => {
			this.systemUserService.getAllSystemUser()
				.pipe(takeUntil(this.destroy))
				.subscribe((response: any) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var data: any = [];
						if (response.ResponseObj?.length) {
							data = response.ResponseObj
						}
						const filteredData = this.filterOnSearch(data);
						params.success({
							rowData: filteredData,
							rowCount: filteredData.length ?? 0
						});
					} else {
						params.fail();
					}
				});
		}
	}

	filterOnSearch(data: any[]): any[] {
		if (!this.searchText) {
			return data;
		}
		return data.filter(item => {
			return JSON.stringify(item).toLowerCase().includes(this.searchText.toLowerCase());
		});
	}

	roles: Role[] = [];
	getAllRole() {
		this.roleService.getAllRole()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.roles = response.ResponseObj;
				}
			})
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
