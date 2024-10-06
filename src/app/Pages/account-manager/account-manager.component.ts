import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-account-manager',
  standalone: true,
  imports: [],
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.css'
})
export class AccountManagerComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Account Manager'));
  }

  ngOnDestroy(): void {
  }
}
