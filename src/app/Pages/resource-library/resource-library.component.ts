
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';
import { HttpClientModule } from '@angular/common/http';
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CommonModule } from '@angular/common';

import {
	GridApi,
	IServerSideGetRowsParams,
	IServerSideDatasource,
	ModuleRegistry,
} from "@ag-grid-community/core";
import { AgGridLayoutComponent } from '../../Common/layout/ag-grid-layout/ag-grid-layout.component';
import { AgGridService } from '../../Common/service/ag-grid.service';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '../../Common/shared/shared.module';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { ActionCellRenderComponent } from './cellRenderer/action-cell-render/action-cell-render.component';
import { CustomDateFormatPipe } from '../../Common/pipes/datefilter.pipe';
import { ModalLayoutComponent } from '../../Common/layout/modal-layout/modal-layout.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { environment } from '../../../environments/environment.prod';
import { ResourceService } from '../../Common/service/resource.service';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
	selector: 'app-resource-library',
	standalone: true,
	imports: [
		CommonModule,
		AgGridAngular,
		HttpClientModule,
		ModalLayoutComponent,
		AgGridLayoutComponent,
		SharedModule
	],
	templateUrl: './resource-library.component.html',
	styleUrl: './resource-library.component.css'
})
export class ResourceLibraryComponent implements OnInit, OnDestroy {
	isexportfilegenerating: boolean = false;
	@ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('imareportDeleteModal', { read: TemplateRef }) imareportDeleteModal: TemplateRef<any>;
	@ViewChild('exporttModal', { read: TemplateRef }) exporttModal: TemplateRef<any>;
	gridApi: GridApi;
	isImporting: boolean = false;
	selectedFile: any;
	modalRef?: BsModalRef;

	constructor(
		private headerService: HeaderService,
		private aggridService: AgGridService,
		private resourceService: ResourceService,
		private datePipe: CustomDateFormatPipe,
		private messageHelperService: MessageHelperService,
		private modalService: BsModalService
	) {

	}

	ngOnInit(): void {
		Promise.resolve().then(() => this.headerService.setTitle('Resource Library'));
	}

	downloadFile(id: number) {
		const baseUrl = environment.BASE_URL;
		const url = "api/Resources/DownloadFile/" + id;
		const a = document.createElement("a");
		a.href = baseUrl + url
		a.setAttribute("download", "data.json");
		document.body.appendChild(a);
		a.click();

		// this.imaReportService.downloadFile(id)
		// 	.pipe(takeUntil(this.destroy))
		// 	.subscribe((response: any) => {
		// 		window.open(URL.createObjectURL(response.body), "_blank");
		// 	});
	}
	onActionImport(actionName: string) {
		this.modalService.hide();
	}

	openExportModal(): void {
		this.modalRef = this.modalService.show(this.exporttModal, { class: 'downloadImportedFilePopupWrap' });
	}

	public rowSelection: "single" | "multiple" = "multiple";
	public columnDefs: any[] = [
		{
			field: '',
			headerCheckboxSelection: (params: { api: { getAllDisplayedColumns: () => any; }; column: any; }) => {
				const displayedColumns = params.api.getAllDisplayedColumns();
				return displayedColumns[0] === params.column;
			},
			checkboxSelection: true,
			cellEditor: "agCheckboxCellEditor",
			maxWidth: 50,
		},
		{
			...this.aggridService.createColumnDef("File Name", "FileName", "agTextColumnFilter"),
		},
		{
			...this.aggridService.createColumnDef("Date Uploaded", "DateUploaded", "agTextColumnFilter"),
			valueFormatter: (params: any) => this.datePipe.transform(params?.data?.DateInserted)
		},
		{
			...this.aggridService.createColumnDef("Action", "Action", "agTextColumnFilter"),
			cellRenderer: "actionCellRenderComponent",
			cellRendererParams: (params: any) => {
				return {
					viewContainerRef: this.viewContainerRef,
					download: (params: any) => this.downloadFile(params.ID),
					delete: (params: any) => this.onDelete(params.ID)
				}
			}
		},
	];

	private ImaId: number = 0;
	onDelete(id: number): void {
		// this.ImaId = id; 
		// this.imareportTitle = 'Delete Client';
		// this.imamodalRef = this.modalService.show(this.imareportDeleteModal);
		// this.imamodalRef.setClass("delete-modal")
	}

	onRemoveimareport(actionName: string, id: string) {
		// if (actionName === 'Yes') {
		// 	if (this.ImaId > 0) {
		// 		this.imaReportService.deleteima(this.ImaId)
		// 			.pipe(takeUntil(this.destroy))
		// 			.subscribe(response => {
		// 				if (response.ResponseCode == ResponseStatus.success) {
		// 					this.gridApi.refreshServerSide();
		// 				}
		// 				this.messageHelperService.showMessage(response.ResponseCode, response.Message);
		// 				this.imamodalRef?.hide();
		// 			})
		// 	} else {
		// 		this.messageHelperService.showMessage(ResponseStatus.fail, "No data found to delete.");
		// 	}
		// } else {
		// 	this.imamodalRef?.hide();
		// }
	}

	onAction(actionName: any) {

	}

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
		},
		components: {
			actionCellRenderComponent: ActionCellRenderComponent,
		}
	}


	/**
	 * aggrid data source with load
	 */
	defaultDataSource: IServerSideDatasource = {
		getRows: (params: IServerSideGetRowsParams) => {
			this.resourceService.getAllFiles()
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

	private _searchText: string = "";
	get searchText(): string {
		return this._searchText;
	}

	set searchText(value: string) {
		this._searchText = value;
		this.gridApi?.setGridOption('serverSideDatasource', this.defaultDataSource);
	}

	filterOnSearch(data: any[]): any[] {
		if (!this.searchText) {
			return data;
		}
		return data.filter(item => {
			return JSON.stringify(item).toLowerCase().includes(this.searchText.toLowerCase());
		});
	}
	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
