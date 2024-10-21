import { ComponentRef, EventEmitter, Injectable, Output, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { AES, enc } from 'crypto-js';
import { GridApi, ICellRendererParams, RowNode } from '@ag-grid-community/core';
import { DatePipe } from '@angular/common';
@Injectable({
	providedIn: 'root'
})
export class DataService {

	destroyForm: BehaviorSubject<any> = new BehaviorSubject(false);
	data: any = {};
	isSidebarToggle: Subject<boolean> = new Subject<boolean>();
	isSidebarMenuToggle: Subject<boolean> = new Subject<boolean>();
	private secretKey = 'zia-420';
	isSidebarOpen: boolean = false;
	isOpenMessageBox: boolean = false;

	/**
	 * 
	 */
	@Output() updateNode: EventEmitter<{ params: ICellRendererParams, newValue: any }> = new EventEmitter<{ params: ICellRendererParams, newValue: any }>();
	/**
	 * 
	 */
	@Output() updateCustomNode: EventEmitter<{ params: ICellRendererParams, newValue: any }> = new EventEmitter<{ params: ICellRendererParams, newValue: any }>();
	/**
	 * 
	 */
	@Output() deleteNode: EventEmitter<ICellRendererParams> = new EventEmitter<ICellRendererParams>();

	constructor() { }

	setData(option: string, value: any): void {
		this.data[option] = value;
	}

	getData(option: string) {
		return this.data[option];
	}

	removeData(): void {
		this.data = {};
	}

	/**
	 * get enum object to all name key of enums
	 * @param enumObj target enum object
	 * @returns 
	 */
	getEnumProperties = (enumObj: any) => {
		return Object.keys(enumObj).filter((item) => {
			return isNaN(Number(item));
		});
	}

	/**
	 * excel and csv file first sheet read and at least return output json
	 * @param file accept excel,csv file
	 * @returns return json
	 */
	excelToJson(file: File): Observable<any[]> {
		return new Observable<any[]>(observable => {
			let fileReader = new FileReader();
			fileReader.onload = (e) => {
				let arrayBuffer: any = fileReader.result;
				var uint8Array = new Uint8Array(arrayBuffer);
				var arr = new Array();
				for (var i = 0; i != uint8Array.length; ++i) {
					arr[i] = String.fromCharCode(uint8Array[i])
				};
				var bstr = arr.join('');
				var workbook = XLSX.read(bstr, { type: 'binary' });
				var first_sheet_name = workbook.SheetNames[0];
				var worksheet = workbook.Sheets[first_sheet_name];
				var excelJson = XLSX.utils.sheet_to_json(worksheet, { raw: true });

				observable.next(excelJson);
			};
			fileReader.readAsArrayBuffer(file);
		});
	}

	/**
	 * Any file to cast as bye64
	 * @param file 
	 * @returns return 64byte string
	 */
	fileToByeString(file: File): Observable<{ fileName: string, size: number, byte64: string }> {
		return new Observable<{ fileName: string, size: number, byte64: string }>(observable => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => observable.next({ fileName: file.name, size: file.size, byte64: reader.result as string });
		});
	}

	encrypt(text: string): string {
		const encrypted = AES.encrypt(text, this.secretKey).toString();
		return enc.Base64.stringify(enc.Utf8.parse(encrypted)).replace("=", "$");
	}

	decrypt(encryptText: string): string {
		const encryptedStr = enc.Base64.parse(encryptText.replace("$", "=")).toString(enc.Utf8);
		return AES.decrypt(encryptedStr, this.secretKey).toString(enc.Utf8);
	}

	/**
	 * 
	 * @param viewContainerRef 
	 * @param componentType 
	 * @param gridApi 
	 * @param rowNode 
	 * @returns 
	 */
	openSidebar<T>(viewContainerRef: ViewContainerRef, componentType: Type<T>, gridApi?: GridApi | undefined, rowNode?: RowNode | undefined): ComponentRef<T> {
		viewContainerRef.clear();
		const componentRef: any = viewContainerRef.createComponent(componentType);
		const isShowInstance = componentRef.instance.isShow;
		if (isShowInstance) {
			isShowInstance.emit(true);
			isShowInstance.subscribe((isShow: boolean) => {
				if (!isShow) {
					componentRef.destroy();
					viewContainerRef.clear();
				}
			});
		}

		const updateGridInstance = componentRef.instance.updateRowNode;
		if (updateGridInstance) {
			updateGridInstance.subscribe((response: any) => {
				if (response) {
					rowNode?.setData(response);
				}
			});
		}
		return componentRef;
	}

	get relationShips() {
		return [
			{ value: 272562, text: "Child" },
			{ value: 272578, text: "Friend" },
			{ value: 272582, text: "GrandParent" },
			{ value: 272600, text: "Parent" },
			{ value: 272601, text: "Relative" },
			{ value: 272604, text: "Sibling" },
			{ value: 272605, text: "SignificantOther" },
			{ value: 272609, text: "Spouse" },
			{ value: -2, text: "Other" },
		]
	}

	getSpecific(start: number, end: number, item: any[]) {
		return item?.slice(start, end);
	}

	convertToLocalTime(date: Date): string | null | Date {
		if (!date) return date;
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(date, 'yyyy-MM-dd')+'T00:00:00.000Z';
		//return date.toISOString()
	}
}
