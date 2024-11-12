import { Component } from '@angular/core';
import { HeaderService } from '../../Common/service/header.service';
import { CounselorDirectoryService } from '../../Common/service/counselor-directory.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { SystemUsers } from '../../Model/system-users';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-counselor-directory',
  standalone: true,
  imports: [NgFor],
  templateUrl: './counselor-directory.component.html',
  styleUrl: './counselor-directory.component.css'
})
export class CounselorDirectoryComponent {
  private destroy: Subject<void> = new Subject<void>();

  constructor(
    private headerService: HeaderService,
    private counselorDirectoryService: CounselorDirectoryService
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Counselor Directory'));
    this.getAllCounselor();
  }

  counselors: any[] = [];
  getAllCounselor() {
    this.counselorDirectoryService.getAllCounselor()
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        if (response.ResponseCode == ResponseStatus.success) {
          this.counselors = response.ResponseObj;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
