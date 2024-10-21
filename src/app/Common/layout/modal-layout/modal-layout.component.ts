import { CommonModule } from '@angular/common';
import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { setTheme } from 'ngx-bootstrap/utils';

/**
 * Common modal template including header and footer
 * Header: Title of the modal
 * Footer: Buttons (ex.: add, update, cancel ....)
*/
@Component({
  selector: 'app-modal-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.css']
})
export class ModalLayoutComponent implements OnInit {
  /**
   * Modal header Title
   */
  @Input() title: string = "Modal title";
  /**
   * Add action buttons and add css class for customize the design  ex. add, cancel, delete
   */
  @Input() objAction: any;
  /**
   * Any button click will fire this event
   */
  @Output() onAction: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
    setTheme("bs5");
   }

  ngOnInit(): void {

  }
}

export interface Action {
  name: string;
  className: string;
  disabled: boolean;
  spinner: boolean;
}
