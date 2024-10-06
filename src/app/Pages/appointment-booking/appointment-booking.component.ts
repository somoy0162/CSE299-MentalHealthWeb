import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.css'
})
export class AppointmentBookingComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Appointment Booking'));
  }

  ngOnDestroy(): void {
  }
}
