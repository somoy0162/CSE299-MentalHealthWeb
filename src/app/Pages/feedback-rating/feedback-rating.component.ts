import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-feedback-rating',
  standalone: true,
  imports: [],
  templateUrl: './feedback-rating.component.html',
  styleUrl: './feedback-rating.component.css'
})
export class FeedbackRatingComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Feedback and Rating'));
  }

  ngOnDestroy(): void {
  }
}
