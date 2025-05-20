import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  today = new Date();
  selectedDate: Date | null = null;
  timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  selectedTime: string | null = null;
  services = ['Taglio', 'Barba', 'Completo'];

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
    console.log('Hai selezionato:', date.toDateString());
    this.selectedTime = null;
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

   selectTime(time: string) {
    this.selectedTime = time;
    console.log('Hai selezionato:', this.selectedDate?.toDateString(), time);
  }

  selectService(services: string) {
    console.log('Hai selezionato:', services);

  }
}
