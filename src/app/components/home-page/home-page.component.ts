import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrenotazioniService } from '../../services/prenotazioni.service';
import Swal from 'sweetalert2';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-home-page',
   standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  providers: [PrenotazioniService],
})
export class HomePageComponent {
  today = new Date();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  selectedService: string | null = null;

  timeSlots = ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45', '12:30', '13:15', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30', '19:15', '20:00'];
  services = ['Taglio', 'Barba', 'Completo'];
  currentAppointment = {
  date: null as Date | null,
  time: null as string | null,
  service: null as string | null,
};

  appointments: { date: Date; time: string; service: string }[] = [];
  showAppointmentsList: boolean | undefined;
  showTimeSlots: boolean | undefined;

constructor(private reservationService: PrenotazioniService) {}

  getNext7Days(): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(this.today);
      date.setDate(this.today.getDate() + i);
      days.push(date);
    }
    return days;
  }

selectDate(date: Date) {
  this.selectedDate = date;
  this.currentAppointment.date = date;
  this.selectedTime = null;
}


  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

selectTime(time: string) {
  this.currentAppointment.time = time;
  this.selectedTime = time;

}


selectService(service: string) {
  this.currentAppointment.service = service;
  this.selectedService = service;
}
addElement() {
  const { date, time, service } = this.currentAppointment;


  if (!date || !time || !service) {
    return;
  }

  // Sostituisci la prenotazione esistente o aggiungi la prima
  if (this.appointments.length > 0) {
    this.appointments[0] = { date, time, service };
  } else {
    this.appointments.push({ date, time, service });
  }

  this.showAppointmentsList = !this.showAppointmentsList;

  this.currentAppointment = {
    date: null,
    time: null,
    service: null,
  };
}

 async confirmReservations() {
    try {
      for (const res of this.appointments) {
        await this.reservationService.addReservation(res);
      }
      Swal.fire({
  title: "Prenotazione effettuata con successo!",
  icon: "success",
   showCancelButton: true,
  confirmButtonText: 'Conferma',
  cancelButtonText: 'Annulla',
  backdrop: true,
  allowOutsideClick: false,
});
      this.appointments = [];
      this.showAppointmentsList = false;
    } catch {
      alert('Errore durante la conferma delle prenotazioni.');
    }
  }
}
