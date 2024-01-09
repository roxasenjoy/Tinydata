import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private _pushToken = null;
  currentMessage = new BehaviorSubject(null);
  currentMessageBody = new BehaviorSubject(null);
  currentMessagetitle = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, private apollo: Apollo) {
  }
  /**
   * web
   * ask web permission
   * get token Firebase Cloud Messaging "FCM"
   * subscribe to FCM notification
   */
  requestPermission() {
    return new Observable(observer => {
      try {
        this.angularFireMessaging.requestToken.subscribe(
          (token : any) => {
            this._pushToken = token;
            observer.next(token);
          },
          (err : any) => {
            observer.error(err);
          }
        );
      } catch (e) {
        observer.error(e);
      }
    });
  }

  getToken() {
    return this._pushToken;
  }
  /**
   * web
   * Receive message listener
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        this.currentMessage.next(payload);
      }, (error : any) => {
        console.log('error');
      });
  }


  askNotificationPermission() {
    return Notification.requestPermission();
  }
}
