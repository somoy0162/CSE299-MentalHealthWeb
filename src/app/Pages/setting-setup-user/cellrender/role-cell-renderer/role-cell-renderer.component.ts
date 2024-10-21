import { Component } from '@angular/core';
import { Role } from '../../../../Model/role';
import { GridApi } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-cell-renderer',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './role-cell-renderer.component.html',
  styleUrl: './role-cell-renderer.component.css'
})
export class RoleCellRendererComponent {
  objRole: Role = new Role();
  params: any;
	lstRole: Role[] = [];
	isLoading: boolean;
	gridApi: GridApi;
	selectedRole: Role | null = null;
  destroy: any;

  constructor() { }

	ngOnInit() {
	}

	agInit(params: any) {
		this.params = params;
		this.gridApi = params.api;
		this.lstRole = this.params.roles;
		this.objRole = JSON.parse(JSON.stringify(params.data));
		const selected = this.lstRole.find((x) => x.RoleID == this.params.value);
		this.objRole.RoleName = selected?.RoleName ?? "Select";
	}

	updateRole(role: Role) {
		
	}
	
	getPageResize(index: any): boolean {
		if (index === 0 || index === 1 || index === 2) {
			return false;
		}
		else {
			return true
		}

	}


	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
