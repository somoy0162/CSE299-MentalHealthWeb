import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';

@Component({
  selector: 'app-resource-library',
  standalone: true,
  imports: [],
  templateUrl: './resource-library.component.html',
  styleUrl: './resource-library.component.css'
})
export class ResourceLibraryComponent {
  constructor(
    private headerService: HeaderService,
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Resource Library'));
  }

  ngOnDestroy(): void {
  }
}
