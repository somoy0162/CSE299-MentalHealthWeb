import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {

	public title: BehaviorSubject<string> = new BehaviorSubject<string>('');
	public subTitle = new BehaviorSubject('');

	constructor() { }

	setTitle(title: string) {
		this.title.next(title);
	}

	setSubTitle(subTitle: string) {
		this.subTitle.next(subTitle);
	}
}