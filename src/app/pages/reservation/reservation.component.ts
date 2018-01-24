import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../_core/services/shared.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { IReservation } from '../../_core/interfaces/reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  uid = '';
  private listing$: Subscription = new Subscription();
  reservations: IReservation[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBookingList();
  }

  async getBookingList() {
    try {
      const user = this.sharedService.getUser();
      if (!user) {
        await this.afAuth.authState.first().toPromise();
        this.uid = await this.afAuth.auth.currentUser.uid;
      } else {
        this.uid = user.id;
      }
      this.listing$ = this.afDB.list(`reservations/${this.uid}`).snapshotChanges()
        .subscribe(items => {
          this.reservations = [];
          items.map(x => {
            const res = {$key: x.key, ...x.payload.val()};
            this.reservations.push(res);
          });
        });
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    this.listing$.unsubscribe();
  }

  showDetails(res: IReservation) {
    this.router.navigate(['/reservations/view/' + res.$key]);
  }

  editReservation(res: IReservation) {
    this.router.navigate(['/reservations/edit/' + res.$key]);
  }

  async deleteReservation(res: IReservation) {
    try {
      await this.afDB.object(`reservations/${this.uid}/${res.$key}`).remove();
    } catch (e) {
      console.log(e);
    }
  }
}
