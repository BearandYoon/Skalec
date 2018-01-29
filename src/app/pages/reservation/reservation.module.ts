import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationComponent } from './reservation.component';
import { ReservationBookingComponent } from './reservation-booking/reservation-booking.component';

import { UploadFileService } from '../../_core/services/upload-file.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationRoutingModule,
    SharedModule
  ],
  declarations: [
    ReservationComponent,
    ReservationBookingComponent
  ],
  providers: [
    UploadFileService
  ]
})
export class ReservationModule { }
