import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-emergency-assistance',
  standalone: true,
  imports: [],
  templateUrl: './emergency-assistance.component.html',
  styleUrl: './emergency-assistance.component.css'
})
export class EmergencyAssistanceComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Emergency Assistance'));
  }

  ngOnDestroy(): void {
  }
}
