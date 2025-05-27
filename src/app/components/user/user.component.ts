import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { PrenotazioniService } from '../../services/prenotazioni.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


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

constructor (private prenotazioni : PrenotazioniService, private auth: AuthService, private router : Router) {}



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

}
