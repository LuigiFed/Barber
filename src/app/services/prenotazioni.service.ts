import { Injectable } from '@angular/core';
import { Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { app } from '../../firebase-config';

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


async getAllReservations(): Promise<any[]> {
  try {
    const colRef = collection(this.firestore, 'reservations');
    const querySnapshot = await getDocs(colRef);
    const reservations: any[] = [];
    querySnapshot.forEach(doc => {
      reservations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return reservations;
  } catch (error) {
    console.error('Errore caricando le prenotazioni:', error);
    return [];
  }
}


async deleteReservation(userId: string): Promise<void>{
  console.log('provo a eliminare lo userId:', userId);
  const db = getFirestore(app);
  const docRef = doc(db, 'reservations',userId);
  await deleteDoc(docRef);


}

async updateReservations(userId: string) : Promise<void> {
 const db = getFirestore(app);
 const docRef = doc(db, 'reservations',userId);
 await updateDoc(docRef, {
   status: 'completed'
 });
}

}
