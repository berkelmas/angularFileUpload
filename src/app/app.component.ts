import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  uid: string;
  pictures: any = [];

  constructor(
    private fireStorage: AngularFireStorage,
    private userService: UserService,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.fireAuth.authState.subscribe(res => this.userService.user_uid.next(res.uid));
    this.userService.user_uid.subscribe(res => {
      this.uid = res;

      this.userService.getUserPhotos(this.uid).subscribe(res => {
        this.pictures = [];
        console.log('subscribed...');
        res.map(item => {

          const filePath = item.payload.doc.data()['filePath']

          this.userService.getUserPhotosDownloadLinks(filePath).subscribe(res => {
            this.pictures.push(res)
          })

        })
      });
    });



  }

  uploadFile(event) {
    this.userService.uploadFileToStorage(event, this.uid)
  }

  handleLogin() {
    this.userService.getUser('deneme@gmail.com', '123456')
  }

  deleteFile(filePath) {
    this.userService.deleteUserPhoto(filePath);
  }
}
