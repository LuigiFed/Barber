import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
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
}
