import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { PrenotazioniService } from '../../services/prenotazioni.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';

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

constructor (private prenotazioni : PrenotazioniService, private auth: AuthService, private router : Router,private calendar: Calendar) {}



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

logout(){
   localStorage.clear();
  this.auth.logout();
  this.router.navigate(['/auth']);
  console.log('Logout effettuato');
}

addToNativeCalendar(reservation: any) {
  const date = new Date(reservation.date);
  const [hours, minutes] = reservation.time.split(':');
  date.setHours(+hours, +minutes);

  this.calendar.createEventInteractively(
    reservation.service,
    'Luogo prenotazione',
    'Descrizione prenotazione',
    date,
    new Date(date.getTime() + 60 * 60 * 1000)
  ).then(() => {
    console.log('Evento creato con successo nel calendario!');
  }).catch(err => {
    console.error('Errore creando evento nel calendario:', err);
  });
}


}
