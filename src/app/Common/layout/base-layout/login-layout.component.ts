import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
	selector: 'app-login-layout',
	standalone: true,
	imports:[RouterOutlet],
	template: `
		<router-outlet />
	`
})
export class LoginLayoutComponent { 
	constructor(){
		setTheme("bs5");
	}
}
