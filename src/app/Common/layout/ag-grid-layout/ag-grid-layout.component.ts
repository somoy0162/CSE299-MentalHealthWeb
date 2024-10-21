import { ColDef, ColumnState, Module, ModuleRegistry, RowNode, SuppressKeyboardEventParams } from "@ag-grid-community/core";

import { ClipboardModule } from "@ag-grid-enterprise/clipboard";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MultiFilterModule } from "@ag-grid-enterprise/multi-filter";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { SideBarModule } from "@ag-grid-enterprise/side-bar";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";

import { Component, EventEmitter, forwardRef, input, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR, FormsModule, FormGroup } from '@angular/forms';
import { AgGridAngular, AgGridModule } from "@ag-grid-community/angular";
import { AgGridService } from "../../service/ag-grid.service";
import { Subject, takeUntil } from "rxjs";
import { ColumnType, defaultTable, KeyBoardKey, ResponseStatus } from "../../enums/appEnums";
import { MessageHelperService } from "../../helper/message-helper.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { LocalstoreService } from "../../service/localstore.service";
import { ActivatedRoute, Params } from "@angular/router";
import { CommonModule, DecimalPipe } from "@angular/common";
import { setTheme } from "ngx-bootstrap/utils";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedModule } from "../../shared/shared.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CustomViews } from "../../../Model/custom-views";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
declare var $: any

ModuleRegistry.registerModules([
	ServerSideRowModelModule,
	MultiFilterModule,
	SetFilterModule,
	SideBarModule,
	FiltersToolPanelModule,
	ColumnsToolPanelModule,
	ClipboardModule,
	RangeSelectionModule,
	MasterDetailModule,
	StatusBarModule,
	RangeSelectionModule,
]);

/**
 * 
 */
@Component({
	selector: 'app-ag-grid-layout',
	standalone: true,
	imports: [
		CommonModule,
		AgGridModule,
		FormsModule,
		SharedModule,
		BsDropdownModule,
		BsDatepickerModule,
		DecimalPipe
	],
	templateUrl: './ag-grid-layout.component.html',
	styleUrls: ['./ag-grid-layout.component.css'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AgGridLayoutComponent),
			multi: true
		}
	]
})
export class AgGridLayoutComponent implements OnInit, OnDestroy {
	@ViewChild('agGrid') public agGrid!: AgGridAngular;
	@ViewChild('filterRemove', { read: TemplateRef }) deletionConfirmation: TemplateRef<any> | undefined;
	@ViewChild('shareFilterModal', { read: TemplateRef }) shareFilterModal: TemplateRef<any> | undefined;
	@Input() rowGroupPanelShow: 'always'
	@Input() columnDefs: any[] = [];
	@Input() hideSearch: boolean = true;
	@Input() overlayNoRowsTemplate: string = "";
	@Input() rowSelection: 'single' | 'multiple'
	@Input() saveFilters: boolean = false;
	@Input() isHistory: boolean = false;
	@Input() customFilterId: any;
	@Input() showGadget: boolean = false;
	@Input() showConfig: boolean = false;
	@Input() IsSettingShow: boolean = false;
	@Input() hideImport: boolean = false;
	@Input() hidename: boolean = false;
	@Input() hidedash: boolean = false;
	@Input() hideformfield: boolean = false;
	modalRef?: BsModalRef;
	@Input() isLoading: boolean = false;
	@Input() hideLayout: boolean = false;
	@Input() hiderefresh: boolean = false;
	@Input() pageName: string = '';

	/**
	 * Any button click will fire this event
	 */
	@Output() onAction: EventEmitter<string> = new EventEmitter<string>();

	/**
   * Add action buttons and add css class for customize the design  ex. add, cancel, delete
   */
	@Input() objAction: any;
	/**
	 * two way data binding implement
	 */
	@Output() searchTextChange = new EventEmitter<string>();
	IsShareAll: boolean = false;
	defaultTable: any = defaultTable;
	modules: Module[] = [ServerSideRowModelModule];

	private destroy: Subject<void> = new Subject<void>();
	keyBoardKeys: any = KeyBoardKey;
	columnType: any = ColumnType;
	filteredCols: string[] = [];
	departmentId: number = 0;

	constructor(
		private aggridService: AgGridService,
		private messageHelper: MessageHelperService,
		private localStoreService: LocalstoreService,
		private readonly activatedRoute: ActivatedRoute
	) {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.departmentId = (!params['departmentId']) ? 0 : params['departmentId'];
		});
		setTheme("bs5");
	}

	userID: number = 0;
	ngOnInit(): void {
		this.userID = this.localStoreService.getData('User').SystemUserID;
		this.getAllSavedViews();
	}

	defaultView: CustomViews;
	getDefaultView() {
		const payload = {
			UserID: this.userID,
			PageName: this.pageName
		}
		this.aggridService.getDefaultView(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.defaultView = response.ResponseObj;
					this.applyView(response.ResponseObj);
				}
			});
	}

	private _page: string = "";
	get page(): string {
		return this._page;
	}

	@Input() set page(value: string) {
		this._page = value;
		this.aggridService.page = value;
		this.aggridService.colDefs = null;
	}

	private _searchText: string = "";
	get searchText(): string {
		return this._searchText;
	}

	@Input() set searchText(value: string) {
		this.searchTextChange.emit(value);
	}

	private _gridOptions: any;
	get gridOptions() {
		return this._gridOptions;
	}

	@Input() set gridOptions(value: any) {
		this._gridOptions = {
			...value,
			onColumnVisible: (params: any) => this.saveColumnDefs(params),
			onFilterChanged: (params: any) => this.filterChanged(params),
			onFirstDataRendered: (params: any) => this.getDefaultView()
		};
		this._gridOptions.defaultColDef = {
			...this._gridOptions.defaultColDef,
			suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
				this.aggridService.keyboardEvent.next(params);
				this.keyboardPress(params);
			}
		}
		this._gridOptions.components = {
			...this._gridOptions.components

		}
	}

	get totalRows(): number {
		const detailRows: any[] = [];
		this.agGrid?.api?.forEachNode((node: any) => {
			if (node.expanded) detailRows.push(node.data);
		});

		let totalCount = this.agGrid?.api?.getDisplayedRowCount() ?? 0;
		totalCount = totalCount - detailRows.length;

		if (totalCount > 0) this.agGrid?.api?.hideOverlay();
		else this.agGrid?.api?.showNoRowsOverlay();

		const model = this.agGrid?.api?.getRenderedNodes()[0];
		return model && !model?.data ? totalCount - 1 : totalCount;
	}


	// saveFilter(form: NgForm, event: any, isSaveAs: boolean): void {
	// 	if (!form.valid) {
	// 		this.messageHelper.showMessage(3, "Please select filter.");
	// 		return;
	// 	}

	// 	const columns = this.agGrid.columnApi.getColumnState()?.map((m: ColumnState) => m?.colId);
	// 	const filterModel = this.agGrid?.api?.getFilterModel();
	// 	const model = {
	// 		filter: filterModel,
	// 		state: columns
	// 	}

	// 	const payload = {
	// 		userID: 0,
	// 		pageName: this.page,
	// 		filterObject: JSON.stringify(model),
	// 		isDefault: false
	// 	}
	// 	this.aggridService.saveCustomFilter(payload)
	// 		.pipe(takeUntil(this.destroy))
	// 		.subscribe((response: any) => {
	// 			this.messageHelper.showMessage(response.ResponseCode, response.Message);
	// 			if (response.ResponseCode == ResponseStatus.success) {
	// 				form.resetForm();
	// 				event.hide();
	// 			}
	// 		});
	// }

	transformFilterModel(filterModel: any): any {
		const filterModels: any[] = [];
		Object.keys(filterModel).forEach((key) => {
			const filter = filterModel[key];
			let objFilter = { colId: key, filterType: filter.filterType, operator: filter.operator };
			if (filter.filterType === "multi") {
				let models: any[] = [];
				filter.filterModels.map((nextFilter: any) => {
					if (nextFilter) {
						models.push(nextFilter);
					}
				});
				filterModels.push(Object.assign(objFilter, { filters: models }));
			} else {
				let models: any[] = [];
				if (filter.condition1) {
					models.push(filter.condition1);
				}
				if (filter.condition2) {
					models.push(filter.condition2);
				} else {
					models.push(filter);
				}
				filterModels.push(Object.assign(objFilter, { filters: models }));
			}
		});;
		filterModel = filterModels;
		return filterModel;
	}

	getDisplayName(colId: string | undefined): string {
		const column = this.columnDefs.find(x => x.field == colId);
		if (column) {
			return column.headerName;
		} else {
			return "";
		}
	}

	refresh(): void {
		this.agGrid?.api?.setFilterModel(null);
		this.agGrid?.columnApi?.resetColumnState();
		this.agGrid?.api?.refreshServerSide();
	}

	selectShareDep(event: any) {
		if (event.target.checked) {
			this.IsShareAll = true;
		} else {
			this.IsShareAll = false;
		}
	}

	saveColumnDefs(params: any): void {
		let storeName = this.page + "ToolPanelColumnDefs";
		let colDefs = this.agGrid?.api?.getColumnDefs();
		if (colDefs) this.localStoreService.setData(storeName, colDefs);
	}

	customColDefs: any = {
		text: { cellRenderer: "customColumnTextComponent" },
		number: { cellRenderer: "customColumnNumberComponent" },
		date: { cellRenderer: "customColumnDateComponent" },
		select: { cellRenderer: "customColumnListComponent" }
	}

	filter: any = {
		text: { filter: "agTextColumnFilter" },
		number: { filter: "agNumberColumnFilter" },
		date: { filter: "customDateFilter" },
		select: { filter: "selectFilter" }
	}

	viewName: string = '';
	onClickViews() {
		this.viewName = '';
		this.viewSearchText = "";
		this.views = this.objViews;
	}

	onToggle(event: any, index: number) {
		this.views.forEach((x, i) => {
			if (i !== index) {
				x.DefaultView = false;
			}
		});
		const payload = {
			...this.views[index],
			DefaultView: event
		}
		this.aggridService.saveCustomView(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
				if (response.ResponseCode == ResponseStatus.success) {
					this.applyView(this.defaultView);
				}
			})
	}

	saveCustomView(event: any) {
		if (this.viewName === '') {
			this.messageHelper.showMessage(ResponseStatus.warning, "View Name Required.");
			return;
		}
		const payload = {
			ID: 0,
			UserID: this.userID,
			PageName: this.pageName,
			ViewName: this.viewName,
			ColumnState: JSON.stringify(this.agGrid.api.getColumnState()),
			DefaultView: false
		}
		this.aggridService.saveCustomView(payload)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.viewName = '';
					this.getAllSavedViews();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
				event?.hide();
			})
	}

	onDeleteView(event: any, view: CustomViews) {
		this.aggridService.deleteCustomView(view)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.views = response.ResponseObj.filter((view: any) => view.PageName === this.pageName);
					this.objViews = this.views;
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
				event?.hide();
			});
	}

	views: CustomViews[] = [];
	getAllSavedViews() {
		this.aggridService.getAllCustomView(this.userID)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: any) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.views = response.ResponseObj.filter((view: any) => view.PageName === this.pageName);
					this.objViews = this.views;
				}
			});
	}

	viewSearchText: string = "";
	objViews: CustomViews[] = [];
	onSearch() {
		if (this.viewSearchText) {
			this.views = this.objViews.filter((view: CustomViews) =>
				view.ViewName.toLowerCase().includes(this.viewSearchText.toLowerCase())
			);
		} else {
			this.views = this.objViews;
		}
	}

	keyboardPress(params: SuppressKeyboardEventParams): void {
		let key = params.event.key?.toUpperCase();
		if (!params) {
			return;
		} else if (params.event.ctrlKey && key == this.keyBoardKeys.KEY_HOME) {
			this.agGrid.api.ensureIndexVisible(0, "top");
			const columns = params.columnApi.getAllDisplayedColumns();
			this.agGrid.api.setFocusedCell(0, columns[columns.length - 1]);
		} else if (params.event.ctrlKey && key == this.keyBoardKeys.KEY_END) {
			this.agGrid.api.ensureIndexVisible(this.totalRows - 1, "bottom");
			const columns = params.columnApi.getAllDisplayedColumns();
			this.agGrid.api.setFocusedCell(this.totalRows - 1, columns[0]);
		}
	}

	applyFilterAndColumnState(model: any) {
		this.agGrid.api.setFilterModel(null);
		const savedModels = JSON.parse(model.FilterObject);

		// apply coolumn state 
		const columnState = savedModels['state'];
		const currentColumnState = this.agGrid.columnApi.getColumnState();
		var savedState: any[] = [];
		columnState?.forEach((colName: string) => {
			const state = currentColumnState?.find((x: ColumnState) => x?.colId == colName);
			savedState.push(state);
		});
		if (savedState?.length) this.agGrid.columnApi.applyColumnState({ state: savedState, applyOrder: true });

		// apply filter model
		const filter = savedModels['filter'];
		Object.keys(filter).forEach((key: string) => {
			const filterInstance = this.agGrid?.api?.getFilterInstance(key);
			filterInstance?.setModel(filter[key]);
		});
		this.agGrid.api.onFilterChanged();
	}

	filterChanged(params: any): void {
		const filter = this.agGrid.api.getFilterModel();
		this.filteredCols = Object.keys(filter);
	}

	clearFilter(): void {
		this.agGrid.api.setFilterModel(null);
		this.agGrid.api.onFilterChanged();
	}

	getDefaultCustomFilter() { }

	getSaveFilters() { }

	shownSaveFilter() { }

	applyView(view: CustomViews): void {
		if (!view?.ColumnState) {
			return;
		}
		const state = JSON.parse(view?.ColumnState ?? '{}');
		this.agGrid.api?.applyColumnState({ state: state, applyOrder: true });
	}

	ngOnDestroy(): void {
		this.modalRef?.hide();
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}

export interface Action {
	name: string;
	className: string;
	disabled: boolean;
	spinner: boolean;
}

