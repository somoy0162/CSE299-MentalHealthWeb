import { CellValueChangedEvent, ColDef, IAggregationStatusPanelParams, ITextFilterParams, SuppressKeyboardEventParams } from '@ag-grid-community/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpHelper } from '../helper/httpHelper';

@Injectable({
	providedIn: 'root'
})
export class AgGridService {

	page: string;
	/**
	 * Ag-Grid surpress Keyboard event.
	 */
	keyboardEvent: Subject<SuppressKeyboardEventParams> = new Subject<SuppressKeyboardEventParams>();
	colDefs: any;
	private _setFilter = ["agSetColumnFilter", "selectFilter"];

	constructor(
		private httpHelper: HttpHelper
	) { }

	permitToSaveDate(params: CellValueChangedEvent, method: (params: CellValueChangedEvent) => unknown) {
		const newValue = params.newValue;
		if (newValue?.length == 0) {
			const data = { ...params.data };
			const colId = params.column.getColId();
			data[colId] = params.oldValue;
			params.node.setData(data);
			return;
		}
		else {
			method(params);
		};
	}
	/**
	 * 
	 * @param headerName 
	 * @param field 
	 */
	createColumnDef(headerName: string, field: string): any;
	createColumnDef(headerName: string, field: string, filter?: string | null, cellRenderer?: { name: string, values: any[] } | any): any;
	createColumnDef(headerName: string, field: string, filter?: string | null, cellRenderer?: { name: string, values: any[] } | any, width?: number, editable?: boolean, valueGetter?: any): any {
		let obj: any = { headerName, field, resizable: true };
		if (width) {
			obj = { ...obj, width };
		}
		if (editable) {
			obj = { ...obj, editable };
		}
		if (filter && !this._setFilter.includes(filter)) {
			obj = { ...obj, filter, filterParams: (params: ITextFilterParams) => { return { suppressAndOrCondition: false } } }
		}
		if (filter && this._setFilter.includes(filter)) {
			obj = { ...obj, filter }
		}
		if (cellRenderer && typeof cellRenderer === "string") {
			obj = { ...obj, cellRenderer };
		}
		if (cellRenderer && typeof cellRenderer !== "string") {
			obj = {
				...obj,
				cellRenderer: cellRenderer.name,
				cellRendererParams: (params: any) => { return { values: cellRenderer.values }; }
			}
		}
		if (valueGetter) {
			obj = Object.assign(obj, { valueGetter });
		}
		return obj;
	}

	/**
	 * Default aggrid configuration setting
	 */
	get gridOptions() {
		
		return {
			rowModelType: "serverSide",
			serverSideStoreType: "partial",
			suppressCopyRowsToClipboard: true,
			// suppressRowClickSelection: true,
			blockLoadDebounceMillis: 1,
			rowBuffer: 0,
			maxConcurrentDatasourceRequests: 1,
			suppressPropertyNamesCheck: true,
			suppressMenuHide: true,

			defaultColDef: {
				minWidth: 120,
				resizable: true,
				sortable: true,
				enableCellChangeFlash: true,
				filterParams: {
					suppressAndOrCondition: true,
				},
			},
			icons: {
				menu: '<span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>',
				filter:
					'<span class="ag-icon ag-icon-filter" style="display:none;" unselectable="on" role="presentation"></span>',
			},
			rowHeight: 36,
			headerHeight: 30,
			tooltipShowDelay: 0,
			// statusBar: {
			// 	statusPanels: [
			// 		// { statusPanel: 'agAggregationComponent' },
			// 		{
			// 			statusPanel: "agAggregationComponent",
			// 			statusPanelParams: {
			// 			  aggFuncs: ["sum"],
			// 			},
			// 		  },

			// 	],			
					
			//   },

			// statusPanels: [
			// 	{
			// 	  statusPanel: "agTotalRowCountComponent",
			// 	  align: "left",
			// 	},
			// 	{
			// 	  statusPanel: "agAggregationComponent",
			// 	  statusPanelParams: {
			// 		aggFuncs: ["avg", "sum"],
			// 	  },
			// 	},
			//   ],
			  

			 
			  
		}
	}

	/**
	 * 
	 * @param t 
	 * @param predicate 
	 * @param changeHightLight 
	 * @returns 
	 */
	highLightCell<T>(t: any[], predicate: (value: T, index: number) => boolean, changeHightLight: boolean = false): string {
		return (t.find(predicate) && changeHightLight) ? "highlight" : "";
	}

	getAllCustomView(id: number) {
		const url = 'api/AgGrid/GetAllCustomViewByUserId/' + id;
		return this.httpHelper.getHelper(url);
	}

	saveCustomView(body: any) {
		const url = 'api/AgGrid/SaveCustomView';
		return this.httpHelper.postHelper(url, body);
	}

	getDefaultView(body: any) {
		const url = 'api/AgGrid/GetDefaultView';
		return this.httpHelper.postHelper(url, body);
	}

	deleteCustomView(body: any) {
		const url = 'api/AgGrid/DeleteCustomView';
		return this.httpHelper.postHelper(url, body);
	}
}


