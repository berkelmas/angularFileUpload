import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import sha256 from 'sha256';

@Injectable({
  providedIn : 'root'
})
export class UserService {
  user_uid: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(
    private fireAuth: AngularFireAuth,
    private fireStorage: AngularFireStorage,
    private fireStore: AngularFirestore
  ) {}

  getUser(email, password) {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => this.user_uid.next(res.user.uid))
      .catch(err => err)
  }

  uploadFileToStorage(event, uid) {

    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name
      const filePath = `${uid}/${event.target.files[0].name}`

      this.uploadOrChangeName(filePath, file, uid, fileName);
    }

  }

  uploadOrChangeName(filePath, file, uid, fileName) {
    const insideFunction = (filePath, file, uid, filename) => {

      this.fireStorage.ref(filePath).getDownloadURL().toPromise()
        .then(res => {
          const newFileName = sha256(filename);
          const newFilePath = `${uid}/${newFileName}.png`
          insideFunction(newFilePath, file, uid, newFileName);
        })
        .catch(err => {
          this.fireStore.collection('users').add({uid: uid, filePath: filePath});
          const ref = this.fireStorage.ref(filePath);
          ref.put(file)
            .then(res => console.log(res))
            .catch(err => err);
        })
    }
    insideFunction(filePath, file, uid, fileName);
  }

  getUserPhotos(uid) {
      return this.fireStore.collection('users', ref => ref.where('uid', '==', uid))
        .snapshotChanges();
  }

  getUserPhotosDownloadLinks(filePath) {
    return this.fireStorage.ref(filePath).getDownloadURL();
  }

  deleteUserPhoto(downloadURL) {
    const fullPath = this.fireStorage.storage.refFromURL(downloadURL).fullPath;
    this.fireStorage.storage.refFromURL(downloadURL).delete()
      .then(res => {
        // dosya silme isleminden sonra da veritabanindan ilgili datalari silmemiz gerekiyor.
        console.log('dosya silme islemi basarili...');
        this.fireStore.collection('users', ref => ref.where('filePath', '==', fullPath)).get()
          .toPromise()
          .then(res => res.forEach(doc => doc.ref.delete()))
      })
      .catch(err => console.log(err));

  }

}
