import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Role } from '../../Model/role';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../Common/shared/shared.module';
import { Permission } from '../../Model/permission';
import { ModalLayoutComponent } from '../../Common/layout/modal-layout/modal-layout.component';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../Common/service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoleService } from '../../Common/service/role.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { PermissionService } from '../../Common/service/permission.service';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { Actions } from '../../Model/actions';
import { RolePermissionMapping } from '../../Model/role-permission-mapping';
import { RoleActionMapping } from '../../Model/role-action-mapping';
import { ActionService } from '../../Common/service/action.service';
import { HeaderService } from '../../Common/service/header.service';
@Component({
  selector: 'app-setting-setup-permission',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule,
    FormsModule,
    ModalLayoutComponent,
    SharedModule],

  templateUrl: './setting-setup-permission.component.html',
  styleUrl: './setting-setup-permission.component.css'
})
export class SettingSetupPermissionComponent implements OnInit {
  modalTitle: string = '';
  modalButtonText: string = '';
  isSuperAdmin: boolean = true;
  private rolemodalRef?: BsModalRef;
  @ViewChild('roleModal', { read: TemplateRef }) roleModal: TemplateRef<any>;
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    public dataService: DataService,
    private modalService: BsModalService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private messageHelperService: MessageHelperService,
    private actionService: ActionService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Role and Permission'));
    this.getAllRoles();
    this.getAllPermission();
  }

  roles: Role[] = [];
  selectedRole: Role = new Role();
  getAllRoles() {
    this.roleService.getAllRole()
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        if (response.ResponseCode === ResponseStatus.success) {
          this.roles = response.ResponseObj;
          this.selectedRole = this.roles[0];
          this.getPermissionActionByRole(this.selectedRole);
        } else {
          this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        }
      });
  }

  permissions: Permission[] = [];
  getAllPermission() {
    this.permissionService.getAllPermission()
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        if (response.ResponseCode == ResponseStatus.success) {
          this.permissions = response.ResponseObj;
        } else {
          this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        }
      })
  }

  existingPermissions: Permission[] = [];
  existingActions: Actions[] = [];
  getPermissionActionByRole(role: Role) {
    this.permissions.forEach(permission => {
      permission.IsChecked = false;
      if (permission.Actions?.length > 0) {
        permission.Actions.forEach(action => {
          action.IsChecked = false;
        })
      }
    });
    this.permissionService.getAllPermissionActionByRoleID(role.RoleID)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        if (response.ResponseCode == ResponseStatus.success) {
          this.existingPermissions = (response.ResponseObj.permissions && response.ResponseObj.permissions?.length > 0) ? response.ResponseObj.permissions : [];
          this.existingActions = (response.ResponseObj.actions && response.ResponseObj.actions?.length > 0) ? response.ResponseObj.actions : [];
          this.updateActionPermissions();
        } else {
          this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        }
      })
  }

  updateActionPermissions() {
    this.permissions.forEach(permission => {
      var existing = this.existingPermissions.filter(p => p.PermissionID == permission.PermissionID)[0];
      if (existing) {
        permission.IsChecked = true;
      }
      if (permission.Actions?.length > 0) {
        permission.Actions.forEach(action => {
          var existAction = this.existingActions.filter(a => a.ActionID == action.ActionID)[0];
          if (existAction) {
            action.IsChecked = true;
          }
        })
      }
    })
  }

  onActionRoleForm(actionName: string) {
    if (actionName == 'Add' || actionName == 'Update') {
      //this.saveRole();
    } else {
      this.rolemodalRef?.hide();
    }
  }

  clickToSelectRole(role: Role) {
    this.selectedRole = role;
    this.getPermissionActionByRole(this.selectedRole);
  }

  udpatePermission(permissionID: number, event: any) {
    var objRolePermissionMapping = new RolePermissionMapping();
    objRolePermissionMapping.PermissionID = permissionID;
    objRolePermissionMapping.RoleID = this.selectedRole.RoleID;

    this.permissionService.saveRolePermissionMapping(objRolePermissionMapping)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        if (response.ResponseCode == ResponseStatus.success) {
          if (!event.target.checked) {
            var existPermission = this.permissions.filter(p => p.PermissionID == objRolePermissionMapping.PermissionID)[0];
            if (existPermission && existPermission.Actions!.length > 0) {
              existPermission.Actions.forEach(action => {
                action.IsChecked = false;
              })
            }
          }
        }
      })
  }

  editPermission(permission: Permission) {
    // this.objPermission = JSON.parse(JSON.stringify(permission));
    // this.openPermissionForm();
  }

  deletePermission(permission: Permission) {

  }

  deleteAction(action: Actions) {

  }

  editAction(action: Actions) {

  }

  updateAction(actionID: number, permissionID: number, event: any) {
    var objRoleActionMapping = new RoleActionMapping();
    objRoleActionMapping.ActionID = actionID;
    objRoleActionMapping.RoleID = this.selectedRole.RoleID;
    objRoleActionMapping.PermissionID = permissionID;

    this.actionService.saveRoleActionMapping(objRoleActionMapping)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        this.messageHelperService.showMessage(response.ResponseCode, response.Message);
      })
  }

  objRole: Role = new Role();
  openRoleForm() {
    this.objRole = new Role();
    this.modalTitle = "Add New Role";
    this.modalButtonText = "Add";
    this.rolemodalRef = this.modalService.show(this.roleModal);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
