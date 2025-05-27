import { Injectable } from '@angular/core';
import { Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { app } from '../../firebase-config';

export interface Reservation {
  service: string;
  time: string;
  date: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrenotazioniService {

  constructor(private firestore: Firestore, private http: HttpClient) {}

async addReservation(reservation: Reservation): Promise<void> {
  try {
    const docRef = doc(this.firestore, 'reservations', reservation.userId);
    await setDoc(docRef, reservation);
    console.log('Prenotazione aggiunta o aggiornata con successo');
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

async checkIfReservationExists(userId: string): Promise<{ date: Date; time: string } | null> {
  const db = getFirestore(app);
  const colRef = collection(db, 'reservations');
  const q = query(colRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;  // Nessuna prenotazione trovata
  }


  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    date: data['date'].toDate ? data['date'].toDate() : new Date(data['date']),
    time: data['time'],
  };
}

async deleteReservation(userId: string): Promise<void>{
  console.log('provo a eliminare lo userId:', userId);
  const db = getFirestore(app);
  const docRef = doc(db, 'reservations',userId);
  await deleteDoc(docRef);


}

async updateReservation(id: string, updatedData: Partial<Reservation>): Promise<void> {
  const db = getFirestore(app);
  const docRef = doc(db, 'reservations', id);
  await updateDoc(docRef, updatedData);
}


}
