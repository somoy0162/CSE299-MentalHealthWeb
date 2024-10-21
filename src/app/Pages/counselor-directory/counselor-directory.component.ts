import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-counselor-directory',
  standalone: true,
  imports: [],
  templateUrl: './counselor-directory.component.html',
  styleUrl: './counselor-directory.component.css'
})
export class CounselorDirectoryComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Counselor Directory'));
  }

  ngOnDestroy(): void {
  }
}
