import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { IUser } from '../../_core/interfaces/user';

import { SharedService } from '../../_core/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: IUser = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  async getUserInfo() {
    try {
      const user = this.sharedService.getUser();
      if (!user) {
        await this.afAuth.authState.first().toPromise();
        const uid = await this.afAuth.auth.currentUser.uid;
        this.user = await this.afDB.object(`users/${uid}`).valueChanges().first().toPromise() as IUser;
      } else {
        this.user = user;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
