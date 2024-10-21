import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Common/shared/shared.module';
import { HeaderService } from '../../Common/service/header.service';


@Component({
  selector: 'app-account-manager',
  standalone: true,
  imports: [RouterLink,
		RouterModule,
		FormsModule,
		CommonModule,
		SharedModule
  ],
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.css'
})
export class AccountManagerComponent {
  isShowPassword: boolean = false;
  isNewShowPassword: boolean = false;
  isConfirmShowPassword: boolean = false;
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Account Manager'));
  }
//Phone number formatting 
 numbersOnlyValidator(event: any) {
  const pattern = /^[0-9\-]*$/;
  if (!pattern.test(event.target.value)) {
    event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
  }
}


onSubmit() {
  // this.systemUserService.updatePersonalDetails(this.objSystemUser)
  //   .pipe(takeUntil(this.destroy))
  //   .subscribe((response: ResponseMessage) => {
  //     this.messageHelperService.showMessage(response.ResponseCode, response.Message);
  //     if (response.ResponseCode == ResponseStatus.success) {
  //     }
  //   });
}
confirmPasswordMatch(): void {
  // if (this.objPassword.newPassword != this.objPassword.confirmPassword) {
  //   this.passowrdForm.controls['confirmPassword'].setErrors({ 'matching': true });
  // } else {
  //   this.passowrdForm.controls['confirmPassword'].setErrors(null);
  // }
}
onUpdatePassword(): void {
  // if (form.invalid) {
  //   this.messageHelperService.showMessage(2, "Must be fill up required fill");
  //   return;
  // }

  // this.systemUserService.updatePassword(this.objPassword)
  //   .subscribe((response: ResponseMessage) => {
  //     this.messageHelperService.showMessage(response.ResponseCode, response.Message);
  //     if (response.ResponseCode == ResponseStatus.success) {
  //       form.resetForm();
  //       this.objPassword = new PasswordChange();
  //     }
  //   });
}

  ngOnDestroy(): void {
  }
}
