import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { IUser } from '../../../_core/interfaces/user';
import { SharedService } from '../../../_core/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  async loginWithSocial(socialType: string) {
    try {
      if (socialType === 'google') {
        await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      } else {
        await this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      }
      const currentUser = await this.afAuth.auth.currentUser;
      const user: IUser = {
        id: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL
      };

      const db = await this.afs.doc(`users/${currentUser.uid}`).valueChanges().first().toPromise();
      if (!db) {
        await this.afs.doc(`users/${currentUser.uid}`).set(user);
      }
      this.sharedService.storeUser(user);
      this.router.navigate(['/reservations']);
    } catch (e) {
    } finally {
    }
  }
}
