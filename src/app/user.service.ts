import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn : 'root'
})
export class UserService {
  user_uid: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(private fireAuth: AngularFireAuth) {}

  getUser(email, password) {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => this.user_uid.next(res.user.uid))
      .catch(err => err)
  }
}
