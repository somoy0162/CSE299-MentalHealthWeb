import { CommonModule } from '@angular/common';
import { Component, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Clients } from '../../../../Model/clients';
import { GridApi } from '@ag-grid-community/core';
import { DataService } from '../../../../Common/service/data.service';

@Component({
  selector: 'app-header-cell-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './header-cell-renderer.component.html',
  styleUrl: './header-cell-renderer.component.css'
})
export class HeaderCellRendererComponent {
  viewContainerRef: ViewContainerRef;
  objClients: Clients = new Clients();
  params: any;
  gridApi: GridApi;
  selected: boolean = false;
  constructor(
    public dataService: DataService,
  ) {

  }
  ngOnInit(): void {

  }

  agInit(params: any) {
    this.params = params;
    this.gridApi = params.api;
  }

  ngModelChange(selected: boolean) {
    this.gridApi.getRenderedNodes().forEach((node) => {
      node.setSelected(selected, false);
      const data = { ...node.data, selected: selected };
      node.setData(data);
    });
  }


}
