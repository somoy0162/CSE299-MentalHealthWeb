import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MessageDto } from './messageDto';
import * as signalR from '@microsoft/signalr'; // import signalR
import { MessageHelperService } from '../helper/message-helper.service';
import { LocalstoreService } from '../service/localstore.service';
import { NotificationType, ROOM } from '../enums/appEnums';
import { DataService } from '../service/data.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {

	private baseUrl = environment.BASE_URL;

	private connection: any = new signalR.HubConnectionBuilder()
		.withUrl(this.baseUrl + 'negotiate', {
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets,
			accessTokenFactory: () => {
				return localStorage.getItem('Token') || '';
			},
		})
		.configureLogging(signalR.LogLevel.Information)
		.build();

	readonly POST_URL = this.baseUrl + 'api/chat/send';

	private receivedMessageObject: Subject<any> = new Subject<any>();
	private sharedObj = new Subject<any>();
	lstOnlineUser: any[] = [];

	constructor(
		private http: HttpClient,
		private messageHelper: MessageHelperService,
		private localStoreService: LocalstoreService,
		private dataService: DataService
	) {
		this.onConnect();
		this.start();

		// this.onClose();
	}

	async start() {
		try {
			if (this.connection.state === signalR.HubConnectionState.Disconnected) {
				this.connection.start().then(() => {
					var user = this.localStoreService.getData("User");
					this.joinRoom(user.SystemUserID);
				}).catch((error: any) => {
					console.error('Error starting connection:', error);
				});
			}

		} catch (err) {
			setTimeout(() => this.start(), 5000);
		}
	}

	onClose(): void {
		this.connection.onclose(async () => {
			await this.start();
		});
	}

	onConnect(): void {
		this.connection.on('RecieveNotification', (user: any, message: any, messageTime: any) => {
			this.receivedMessageObject.next({
				User: user, MessageObject: message,
				// Contact: undefined,
				// ResponseType: 0,
				// UserID: 0
			});
		});

		this.connection.on('ConnectedUser', (user: any) => {
			this.lstOnlineUser = user;
			// sessionStorage.setItem("ConnectedUser", user);
		});
	}

	getConnectedUser() {
		return this.connection.invoke("GetConnectedUser");
	}

	findOnlineUser() {

	}

	// Join Room 
	async joinRoom(userId: any) {
		if (this.connection.state === signalR.HubConnectionState.Connected) {
			return this.connection.invoke("JoinRoom", { UserID: userId!.toString(), Room: ROOM });
		}
	}

	// Send Message 
	async sendMessage(message: any) {
		return this.connection?.invoke("SendMessage", message);
	}

	// Leave
	async leaveRoom() {
		return this.connection.stop();
	}


	messageRecieved(receiver: any, message: any) {
		this.receivedMessageObject.next({
			User: receiver, MessageText: message,
			Contact: undefined,
			ResponseType: 0,
			UserID: 0
		});
		// let userId = this.securityService.activeUser.userId;
		this.sharedObj.next(this.receivedMessageObject);
	}

	private mapReceivedMessage(user: string, message: string): void {
		this.receivedMessageObject.next({
			User: user, MessageText: message,
			Contact: undefined,
			ResponseType: 0,
			UserID: 0
		});
		this.sharedObj.next(this.receivedMessageObject);
	}


	/* ****************************** Public Methods **************************************** */

	// Calls the controller method
	public broadcastMessage(msgDto: any) {
		this.http
			.post(this.POST_URL, msgDto)
			.subscribe((data) => console.log(data));
		// this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
	}

	// public retrieveMappedObject(): Observable<any> {
	// 	return this.sharedObj.asObservable();
	// }
	public retrieveMappedObject(): Observable<any> {
		return this.receivedMessageObject.asObservable();
	}

}
