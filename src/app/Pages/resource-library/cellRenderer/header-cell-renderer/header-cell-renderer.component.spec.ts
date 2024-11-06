import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCellRendererComponent } from './header-cell-renderer.component';

describe('HeaderCellRendererComponent', () => {
  let component: HeaderCellRendererComponent;
  let fixture: ComponentFixture<HeaderCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCellRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
