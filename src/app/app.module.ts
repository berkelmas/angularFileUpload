import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBW6gshYwkHriXucWPNcLOLgnopvyZ54g",
  authDomain: "dosyayuklefire.firebaseapp.com",
  databaseURL: "https://dosyayuklefire.firebaseio.com",
  projectId: "dosyayuklefire",
  storageBucket: "dosyayuklefire.appspot.com",
  messagingSenderId: "141924497372",
  appId: "1:141924497372:web:ee3ef6114dc23976"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
