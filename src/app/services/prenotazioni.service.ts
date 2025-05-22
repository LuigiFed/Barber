import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

export interface Reservation {
  service: string;
  time: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PrenotazioniService {

  constructor(private firestore: Firestore, private http: HttpClient) {}

  async addReservation(reservation: Reservation): Promise<void> {
    try {
      const colRef = collection(this.firestore, 'reservations');
      await addDoc(colRef, reservation);
      console.log('Prenotazione aggiunta con successo');
    } catch (error) {
      console.error('Errore aggiungendo la prenotazione:', error);
      throw error;
    }
  }
    async getBookedTimeSlots(date: string): Promise<string[]> {
    const bookedTimes: string[] = [];
    try {
      // Supponiamo che la collection si chiami "prenotazioni"
      // e che ogni documento abbia campi: date (stringa 'YYYY-MM-DD') e time (stringa 'HH:mm')
      const prenotazioniRef = collection(this.firestore, 'prenotazioni');
      const q = query(prenotazioniRef, where('date', '==', date));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        const data = doc.data();
   if (data['time']) {
  bookedTimes.push(data['time']);
}

      });

      return bookedTimes;
    } catch (error) {
      console.error('Errore caricando orari prenotati da Firestore:', error);
      return [];
    }
  }
}
