import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-session-history',
  standalone: true,
  imports: [],
  templateUrl: './session-history.component.html',
  styleUrl: './session-history.component.css'
})
export class SessionHistoryComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Session History'));
  }

  ngOnDestroy(): void {
  }
}
