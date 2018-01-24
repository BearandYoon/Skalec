import {Component, OnChanges, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { SharedService } from '../../../_core/services/shared.service';
import { IReservation } from '../../../_core/interfaces/reservation';
import { IUser } from '../../../_core/interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSunday,
  isWeekend,
  isTuesday,
  isWednesday,
  isThursday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks
} from 'date-fns';

export enum EPageType {
  CreatePage,
  EditPage,
  ViewPage
}

@Component({
  selector: 'app-reservation-booking',
  templateUrl: './reservation-booking.component.html',
  styleUrls: ['./reservation-booking.component.scss']
})
export class ReservationBookingComponent implements OnInit, OnChanges {

  dayModifier: Function;
  minDate: Date = subDays(new Date(), 1);
  maxDate: Date = addWeeks(new Date(), 2);
  viewDate: Date = new Date();
  reservation: IReservation = {name: '', email: '', reservationDate: this.viewDate.toDateString(), phone: ''};
  uid = '';

  enum_PageType = EPageType;
  pageType: EPageType = EPageType.CreatePage;

  form: FormGroup;

  constructor(
    private sharedService: SharedService,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private router: Router,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.dayModifier = function (day: Date): string {
      if (!this.dateIsValid(day)) {
        // day.cssClass = 'cal-disabled';
        return 'disabled';
      }
      return '';
    }.bind(this);
    this.dateOrViewChanged();

    this.form = this.formBuilder.group({
      'reservationDate' : [this.reservation.reservationDate],
      'name': [this.reservation.name, Validators.required],
      'email': [this.reservation.email, Validators.required]
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.method === 'edit') {
        this.pageType = EPageType.EditPage;
        this.getReservation(params.id);
      } else if (params.method === 'view') {
        this.pageType = EPageType.ViewPage;
        this.getReservation(params.id);
      } else {
        this.pageType = EPageType.CreatePage;
      }
    });
  }

  ngOnChanges() {
    if (this.reservation) {
      this.form.patchValue(this.reservation);
    }
  }

  async getReservation(id: string) {
    try {
      const user = this.sharedService.getUser();
      if (!user) {
        await this.afAuth.authState.first().toPromise();
        this.uid = await this.afAuth.auth.currentUser.uid;
      } else {
        this.uid = user.id;
      }
      this.reservation = await this.afDB.object(`reservations/${this.uid}/${id}`).valueChanges().first().toPromise() as IReservation;
      if (this.reservation) {
        this.reservation.$key = id;
        this.form.setValue({...this.reservation});
      }
    } catch (e) {
    }
  }

  async onSubmit() {
    try {
      const user: IUser = this.sharedService.getUser();
      let uid = '';
      if (!user.id) {
        await this.afAuth.authState.first().toPromise();
        uid = this.afAuth.auth.currentUser.uid;
      } else {
        uid = user.id;
      }
      if (this.pageType === EPageType.CreatePage) {
        await this.afDB.list(`reservations/${uid}`).push(this.form.value);
      } else if (this.pageType === EPageType.EditPage) {
        await this.afDB.object(`reservations/${uid}/${this.reservation.$key}`).update(this.form.value);
      }
      this.router.navigate(['/reservations']);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  dayClicked(e) {
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  dateOrViewChanged(): void {
  }

}