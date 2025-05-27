import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { PrenotazioniService } from '../../services/prenotazioni.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [NavComponent,CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

allReservations: any[] = [];

ngOnInit() {
  this.loadAllReservations();
}

constructor (private prenotazioni : PrenotazioniService){}



async loadAllReservations() {
  try {
    this.allReservations = await this.prenotazioni.getAllReservations();

    this.allReservations = this.allReservations.map(reservation => ({
      ...reservation,
       date: reservation.date.toDate()
    }))
  } catch (error) {
    console.error('Errore caricando le prenotazioni:', error);
  }
}


deleteReservation(reservationId: string) {
  this.prenotazioni.deleteReservation(reservationId)
    .then(() => {
      console.log('Prenotazione eliminata con successo');
    this.loadAllReservations();
    })
    .catch(error => {
      console.error('Errore eliminando la prenotazione:', error);
    });



}

}
