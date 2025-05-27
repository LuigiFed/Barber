import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { PrenotazioniService } from '../../services/prenotazioni.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  imports: [NavComponent,CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

allReservations: any[] = [];
@ViewChild('deleteReservationMessage') existingReservation!: TemplateRef<any>;
ngOnInit() {
  this.loadAllReservations();
}

constructor (private prenotazioni : PrenotazioniService, private auth: AuthService, private router : Router,    private dialog: MatDialog) {}



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


deleteReservation(reservationId: string, reservationDate: Date) {
  const now = new Date();
  const diffMs = reservationDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 72) {
        this.dialog.open(this.existingReservation, {
                panelClass: 'my-custom-dialog',
              });
    return;
  }

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
