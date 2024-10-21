import { Actions } from "./actions";
export class Permission  {
    PermissionID: number;
    PermissionName: string;
    DisplayName: string;
    IsChecked: boolean = false;
    Actions: Actions[] = [];
    IsShowActions: boolean = true;
}
