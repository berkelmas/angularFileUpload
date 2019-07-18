import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';

import sha256 from 'sha256';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  uid: string;

  constructor(
    private fireStorage: AngularFireStorage,
    private userService: UserService,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.fireAuth.authState.subscribe(res => this.userService.user_uid.next(res.uid));
    this.userService.user_uid.subscribe(res => this.uid = res);

  }

  uploadFile(event) {

    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name
      const uid = this.uid;
      const filePath = `${this.uid}/${event.target.files[0].name}`

      this.uploadOrChangeName(filePath, file, uid, fileName);
    }


  }

  uploadOrChangeName(filePath, file, uid, filename) {
    const insideFunction = (filePath, file, uid, filename) => {

      this.fireStorage.ref(filePath).getDownloadURL().toPromise()
        .then(res => {
          const newFileName = sha256(filename);
          const newFilePath = `${uid}/${newFileName}.png`
          insideFunction(newFilePath, file, uid, newFileName);
        })
        .catch(err => {
          const ref = this.fireStorage.ref(filePath);
          ref.put(file)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        })
    }
    insideFunction(filePath, file, uid, filename);
  }


  handleLogin() {
    this.userService.getUser('deneme@gmail.com', '123456')
  }

  getFiles() {
    this.fireStorage.ref(`${this.uid}/profilesds.jpeg`).getDownloadURL().toPromise()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
}
