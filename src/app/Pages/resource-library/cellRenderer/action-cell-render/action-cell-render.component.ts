import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Role } from '../../../../Model/role';
import { GridApi } from '@ag-grid-community/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Clients } from '../../../../Model/clients';
import { DataService } from '../../../../Common/service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResourceService } from '../../../../Common/service/resource.service';


@Component({
	selector: 'app-action-cell-render',
	standalone: true,
	imports: [CommonModule,
		FormsModule,],
	templateUrl: './action-cell-render.component.html',
	styleUrl: './action-cell-render.component.css'
})
export class ActionCellRenderComponent implements OnInit, OnDestroy {
	// @ViewChild('clientFormModal', { read: TemplateRef }) clientFormModal: TemplateRef<any>;
	isEdit: boolean = false;
	params: any;
	clientmodalRef?: BsModalRef;
	gridApi: GridApi;
	selected: boolean = false;
	viewContainerRef: ViewContainerRef;
	destroy: Subject<void> = new Subject<void>();

	constructor(
		private readonly modalService: BsModalService,
		public dataService: DataService,
		public resourceService: ResourceService,

	) { }


	ngOnInit() {
	}

	agInit(params: any) {
		this.params = params;
		this.gridApi = params.api;
		this.viewContainerRef = params.viewContainerRef;
		this.selected = this.params.data.selected;
	}



	onDownloadAttachment() {
		this.params.download(this.params.data);
	}

	deleteSystemUser() {
		this.params.delete(this.params.data);
	}

	// viewDetails(): void {
	// 	this.openSidebar();
	// }

	// openSidebar(): void {
	// 	const data = { ...this.params.data };
	// 	this.params.node.setData(data);
	// 	this.params.node.setSelected(true, false);
	// 	const componentRef = this.dataService.openSidebar(
	// 		this.viewContainerRef,
	// 		ClientsDetailsSidebarComponent,
	// 		this.gridApi,
	// 		this.params.node
	// 	);

	// 	componentRef.instance.objClients = this.params.node.data;
	// 	componentRef.instance.edit = this.params.edit;
	// 	componentRef.instance.gridApi = this.params.api;
	// }

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
