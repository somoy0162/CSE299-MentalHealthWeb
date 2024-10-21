import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCellRendererComponent } from './role-cell-renderer.component';

describe('RoleCellRendererComponent', () => {
  let component: RoleCellRendererComponent;
  let fixture: ComponentFixture<RoleCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCellRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
