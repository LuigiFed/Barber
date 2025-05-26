import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrenotazioniService } from '../../services/prenotazioni.service';
import Swal from 'sweetalert2';
import { NavComponent } from '../nav/nav.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { getAuth } from 'firebase/auth';
import { app } from '../../../firebase-config';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, NavComponent, MatDialogModule, MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [PrenotazioniService],
})
export class HomePageComponent {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  @ViewChild('notLoggedDialog') notLoggedDialog!: TemplateRef<any>;

  today = new Date();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  selectedService: string | null = null;

  timeSlots = [
    '08:00',
    '08:45',
    '09:30',
    '10:15',
    '11:00',
    '11:45',
    '12:30',
    '13:15',
    '14:00',
    '14:45',
    '15:30',
    '16:15',
    '17:00',
    '17:45',
    '18:30',
    '19:15',
    '20:00',
  ];
  services = ['Taglio', 'Barba', 'Completo'];
  currentAppointment = {
    date: null as Date | null,
    time: null as string | null,
    service: null as string | null
  };
bookedTimeSlots: string[] = [];
  appointments: { date: Date; time: string; service: string }[] = [];
  showAppointmentsList: boolean | undefined;
  showTimeSlots: boolean | undefined;

  constructor(
    private reservationService: PrenotazioniService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

getNext7Days(): Date[] {
  const days: Date[] = [];
  let i = 0;
  while (days.length < 14) {  // vogliamo 7 giorni validi
    const date = new Date(this.today);
    date.setDate(this.today.getDate() + i);

    const dayOfWeek = date.getDay(); // domenica = 0, lunedi = 1
    if (dayOfWeek !== 0 && dayOfWeek !== 1) {
      days.push(date);
    }
    i++;
  }
  return days;
}
getAvailableTimeSlots(): string[] {
  return this.timeSlots.filter(t => !this.bookedTimeSlots.includes(t));
}

formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  return `${y}-${m}-${d}`;
}
async selectDate(date: Date) {
  if (this.selectedDate?.toDateString() === date.toDateString()) {
    this.selectedDate = null;
    this.currentAppointment.date = null;
    this.selectedTime = null;
    this.currentAppointment.time = null;
    this.bookedTimeSlots = [];
  } else {
    this.selectedDate = date;
    this.currentAppointment.date = date;

    // formatta la data come stringa 'YYYY-MM-DD' per Firestore
    const formattedDate = this.formatDate(date);

    // aspetta la lista degli orari già prenotati per la data selezionata
    this.bookedTimeSlots = await this.reservationService.getBookedTimeSlots(formattedDate);
  }
}

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }
  isSelectedTime(t: string): boolean {
  return this.selectedTime === t;
}

  selectTime(time: string) {
    if (this.selectedTime === time) {
      this.selectedTime = null;
      this.currentAppointment.time = null;
    } else {
      this.selectedTime = time;
      this.currentAppointment.time = time;
    }
  }

  selectService(service: string) {
    if (this.selectedService === service) {
      this.selectedService = null;
      this.currentAppointment.service = null;
    } else {
      this.selectedService = service;
      this.currentAppointment.service = service;
    }
  }
addElement() {
  const { date, time, service} = this.currentAppointment;

  if (!date || !time || !service) {
    return;
  }


  if (this.appointments.length > 0) {
    this.appointments[0] = { date, time, service};
  } else {
    this.appointments.push({ date, time, service});
  }

  localStorage.setItem("currentAppointment", JSON.stringify({
    date,
    time,
    service
  }));

  if (!this.bookedTimeSlots.includes(time)) {
    this.bookedTimeSlots.push(time);
  }

  this.showAppointmentsList = true;

  this.currentAppointment = {
    date: null,
    time: null,
    service: null
  };
}

  closeDialog(result: boolean) {
    this.dialog.closeAll();

    if (result) {
      console.log('Prenotazione confermata');
      this.appointments = [];
      this.showAppointmentsList = false;
    } else {
      console.log('Prenotazione annullata');
    }
  }

 async confirmReservations() {
  if (this.appointments.length === 0) return;

  if (!this.authService.isLoggedIn()) {
    this.dialog.open(this.notLoggedDialog);
    return;
  }

  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    this.dialog.open(this.notLoggedDialog);
    return;
  }

  // Recupera i dati dell’utente
  const userData = await this.authService.getUserData(user.uid);

  if (!userData) {
    console.error('Dati utente non trovati');
    return;
  }

  const dialogRef = this.dialog.open(this.confirmDialog, {
    disableClose: true,
    panelClass: 'my-custom-dialog',
  });

  dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
    if (confirmed) {
      for (const res of this.appointments) {
        // Aggiungi anche i dati utente alla prenotazione
        const reservationWithUser = {
          ...res,
          name: userData['name'],
          surname: userData['surname'],
          phone: userData['phone'],
          userId: user.uid // se vuoi tener traccia dell’utente
        };

        await this.reservationService.addReservation(reservationWithUser);
      }

      this.appointments = [];
      this.showAppointmentsList = false;
      this.currentAppointment = { date: null, time: null, service: null };
      this.selectedDate = null;
      this.selectedTime = null;
      this.selectedService = null;

      console.log('Prenotazione confermata');

      this.dialog.open(this.successDialog, {
        panelClass: 'my-custom-dialog',
      });
    } else {
      console.log('Prenotazione annullata');
    }
  });
}

}
